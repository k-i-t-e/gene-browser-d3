package com.epam.gene.browser.d3.manager;

import com.epam.gene.browser.d3.vo.CytoBand;
import com.epam.gene.browser.d3.vo.GiemsaStain;
import javafx.util.Pair;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: mmiroliubov
 * Date: 12.10.15
 * Time: 16:23
 *
 * Parses cytoBand file with the following format:
 * chrom	chr1	string - Chromosome
 * chromStart	0	integer - Start position in chromosome sequence
 * chromEnd	2300000	integer - End position in chromosome sequence
 * name	p36.33	string - Name of cytogenetic band
 * gieStain	gneg string - Giemsa stain results.
 * Recognized stain values: gneg, gpos50, gpos75, gpos25, gpos100, acen, gvar, stalk
 */
@Service
public class CytoBandManager {
    private static final String FILE_NAME = "/home/kite/workspace/gene-browser-d3/cytoBand.txt";
    private static final boolean USE_INDEX = true;
    //private static final String FILE_NAME = "/home/kite/workspace/gene-browser-d3/cytoBandIdeo.txt";

    public List<CytoBand> readCytoBand(String chr) throws IOException {
        File indexFile = new File(FILE_NAME + ".idx");
        if (indexFile.exists() && ! indexFile.isDirectory() && USE_INDEX) {
            return readWithIndex(chr);
        } else {
            return readNoIndex(chr, true);
        }
    }

    private List<CytoBand> readWithIndex(String chr) throws IOException {
        List<CytoBand> bands = new ArrayList<>();
        BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(FILE_NAME)));

            Map<String, List<Integer>> indexMap = readIndex();

            int from = indexMap.get(chr).get(0);
            int to = indexMap.get(chr).get(1);

            br.skip(from);

            char[] buf = new char[to - from];
            br.read(buf, 0, to - from);
            String str = new String(buf);

            String[] strings = str.split("\n");
            for (String s : strings) {
                String[] fields = s.split("\t");
                CytoBand band = new CytoBand();
                band.setChr(fields[0]);

                if (!chr.equals(fields[0])) {
                    continue;
                }

                band.setStart(Long.parseLong(fields[1]));
                band.setEnd(Long.parseLong(fields[2]));
                band.setName(fields[3]);
                band.setStain(GiemsaStain.valueOf(fields[4].toUpperCase()));

                bands.add(band);
            }
        } finally {
            if (br != null) {
                br.close();
            }
        }

        return bands;
    }

    private List<CytoBand> readNoIndex(String chr, boolean writeIndex) throws IOException {
        List<CytoBand> bands = new ArrayList<>();
        Map<String, List<Integer>> indexMap = new LinkedHashMap<>();
        BufferedReader br = null;

        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(FILE_NAME)));
            int i = 0;
            String prevChr = null;
            String prevStr = "";
            while (true) {
                String str = br.readLine();
                if (str == null) {
                    break;
                } else {
                    prevStr = str;
                }

                String[] fields = str.split("\t");
                CytoBand band = new CytoBand();
                band.setChr(fields[0]);

                prevChr = putIndex(indexMap, i, prevChr, fields[0], str.length());
                i += (str.length() + 1);

                if (!chr.equals(fields[0])) {
                    continue;
                }

                band.setStart(Long.parseLong(fields[1]));
                band.setEnd(Long.parseLong(fields[2]));
                band.setName(fields[3]);
                band.setStain(GiemsaStain.valueOf(fields[4].toUpperCase()));

                bands.add(band);
            }

            putIndex(indexMap, i, prevChr, "", prevStr.length());

            if (writeIndex) {
                writeIndex(indexMap);
            }
        } finally {
            if (br != null) {
                br.close();
            }
        }

        return bands;
    }

    private String putIndex(Map<String, List<Integer>> indexMap, int i, String prevChr, String currChr, int next) {
        if (prevChr == null) {
            List<Integer> indexes = new ArrayList<>();
            indexes.add(i);
            indexMap.put(currChr, indexes);

            prevChr = currChr;
            return prevChr;
        }

        if (!currChr.equals(prevChr)) {
            if (!indexMap.containsKey(prevChr)) {
                indexMap.put(prevChr, new ArrayList<>());
            }

            indexMap.get(prevChr).add(i);

            if (!currChr.isEmpty()) {
                List<Integer> indexes = new ArrayList<>();
                indexes.add(i);
                indexMap.put(currChr, indexes);
                prevChr = currChr;
            }
        }

        return prevChr;
    }

    private void writeIndex(Map<String, List<Integer>> indexMap) throws IOException {
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(FILE_NAME + ".idx")));

            for (Map.Entry<String, List<Integer>> entry : indexMap.entrySet()) {
                writer.write(String.format("%s\t%d\t%d", entry.getKey(), entry.getValue().get(0),
                        entry.getValue().get(1)));
                writer.newLine();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private Map<String, List<Integer>> readIndex() throws IOException {
        BufferedReader reader = null;
        Map<String, List<Integer>> indexMap = new LinkedHashMap<>();
        try {
            reader = new BufferedReader(new FileReader(FILE_NAME + ".idx"));
            while (true) {
                String str = reader.readLine();
                if (str == null) {
                    break;
                }

                String[] fields = str.split("\t");

                List<Integer> list = new ArrayList<>();
                list.add(Integer.parseInt(fields[1]));
                list.add(Integer.parseInt(fields[2]));

                indexMap.put(fields[0], list);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return indexMap;
    }
}
