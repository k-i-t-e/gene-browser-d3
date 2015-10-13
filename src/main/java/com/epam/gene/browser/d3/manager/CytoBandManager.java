package com.epam.gene.browser.d3.manager;

import com.epam.gene.browser.d3.vo.CytoBand;
import com.epam.gene.browser.d3.vo.GiemsaStain;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

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
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(FILE_NAME)));
            while (true) {
                String str = br.readLine();
                if (str == null) {
                    break;
                }

                String[] fields = str.split("\t");
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
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return bands;
    }
}
