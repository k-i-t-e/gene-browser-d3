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
    //private static final String FILE_NAME = "/home/kite/workspace/gene-browser-d3/cytoBandIdeo.txt";

    public List<CytoBand> readCytoBand(String chr) throws IOException {
        List<CytoBand> bands = new ArrayList<>();

        BufferedReader br = null;
        Map<String, List<Integer>> indexMap = new LinkedHashMap<>();
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
                i += str.length();

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

            writeIndex(indexMap);
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
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

            indexMap.get(prevChr).add(i - next);

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
}
