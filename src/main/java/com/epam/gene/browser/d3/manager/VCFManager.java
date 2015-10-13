package com.epam.gene.browser.d3.manager;

import com.epam.gene.browser.d3.vo.BrowseRequest;
import com.epam.gene.browser.d3.vo.Variant;
import htsjdk.samtools.util.CloseableIterator;
import htsjdk.tribble.AbstractFeatureReader;
import htsjdk.tribble.CloseableTribbleIterator;
import htsjdk.tribble.FeatureReader;
import htsjdk.tribble.index.Index;
import htsjdk.tribble.index.IndexFactory;
import htsjdk.tribble.index.interval.IntervalTreeIndex;
import htsjdk.tribble.index.tabix.TabixFormat;
import htsjdk.tribble.index.tabix.TabixIndex;
import htsjdk.variant.variantcontext.Allele;
import htsjdk.variant.variantcontext.Genotype;
import htsjdk.variant.variantcontext.VariantContext;
import htsjdk.variant.vcf.VCFCodec;
import htsjdk.variant.vcf.VCFFileReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.zip.GZIPInputStream;

/**
 * Created with IntelliJ IDEA.
 * User: mmiroliubov
 * Date: 18.09.15
 * Time: 14:27
 */
@Service
public class VCFManager {
    Logger logger = LoggerFactory.getLogger(VCFManager.class);

    public String readReference() throws IOException {

        GZIPInputStream gzipInputStream = null;
        InputStreamReader inputStreamReader = null;
        BufferedReader reader = null;
        try {
            gzipInputStream = new GZIPInputStream(new FileInputStream("Felis_catus.Felis_catus_6.2.dna" +
                    ".chromosome.A1.fa.gz"));
            inputStreamReader = new InputStreamReader(gzipInputStream);
            //char []buffer = new char[2500];
            //inputStreamReader.read(buffer, 2772058, 2499);
            reader = new BufferedReader(inputStreamReader);
            reader.lines().forEach(new Consumer<String>() {
                @Override
                public void accept(String s) {
                    logger.info(s);
                }
            });
            String ref = reader.readLine();
            //return new String(buffer);
            return ref;
        } finally {
            if (inputStreamReader != null) {
                inputStreamReader.close();
            }
            if (gzipInputStream != null) {
                gzipInputStream.close();
            }
        }
    }

    public List<Variant> readVcf(BrowseRequest request) throws IOException {
        VCFCodec codec = new VCFCodec();

        String fileName = "/home/kite/workspace/gene-browser-d3/Felis_catus.vcf";
        //String fileName = "YRI.trio.2010_03.genotypes.vcf.gz";

        File indexFile = new File(fileName + ".idx");
        Index index;
        if (indexFile.exists() && !indexFile.isDirectory()) {
            index = IndexFactory.loadIndex(fileName + ".idx");
        } else {
            index = createIndex(fileName, codec);
        }


        /*File file = new File(fileName);
        File indexFile = new File(fileName + ".tbi");
        if (!indexFile.exists() || indexFile.isDirectory()) {
            VCFFileReader reader = new VCFFileReader(file, false);
            String indexFileName = createTabixIndex(fileName, codec, reader);
            indexFile = new File(indexFileName);
        }*/

        //File indexFile = new File("Felis_catus.vcf.gz.tbi");
        //TabixIndex index = new TabixIndex(indexFile);

        //VCFFileReader reader = new VCFFileReader(file, indexFile, true);

        /*VCFFileReader reader = new VCFFileReader(new IntervalTreeIndex(fileName).getIndexedFile(),
                new IntervalTreeIndex("Felis_catus.vcf.gz.tbi").getIndexedFile(), true);*/

        /*FeatureReader<VariantContext> reader = AbstractFeatureReader.getFeatureReader(fileName,
                indexFile.getAbsolutePath(), codec, true);*/
        //CloseableTribbleIterator<VariantContext> iterator = reader.iterator();


        FeatureReader<VariantContext> reader = AbstractFeatureReader.getFeatureReader(fileName, codec, index);
        CloseableIterator<VariantContext> iterator = reader.iterator();

        iterator = reader.query(request.getChrId(), request.getFrom(), request.getTo());

        ArrayList<Variant> variants = new ArrayList<>();
        if (request.isBigZoom()) {
            while (iterator.hasNext()) {
                VariantContext context = iterator.next();
                String ref = context.getReference().getDisplayString();
                List<String> alt = context.getAlternateAlleles().stream().map(Allele::getDisplayString).collect(Collectors.toList());
                List<Genotype> genotypes = context.getGenotypes();

                boolean hom = false;
                if (genotypes.isEmpty()) {
                    hom = true;
                } else {
                    if (genotypes.get(0).isHom()) {
                        hom = true;
                    }
                }

                variants.add(new Variant((long) context.getStart(), ref, alt, hom));
            }
        } else {
            int count = (int) Math.ceil((request.getTo() - request.getFrom()) / (double) request.getWidth());
            int from = request.getFrom();
            int to = from + count;
            boolean found = false;
            while (iterator.hasNext()) {
                VariantContext context = iterator.next();

                if (context.getStart() > to) {
                    found = false;
                    to += count;
                }
                if (!found) {
                    String ref = context.getReference().getDisplayString();
                    List<String> alt = context.getAlternateAlleles().stream().map(Allele::getDisplayString).collect(Collectors.toList());
                    List<Genotype> genotypes = context.getGenotypes();

                    boolean hom = false;
                    if (genotypes.isEmpty()) {
                        hom = true;
                    } else {
                        if (genotypes.get(0).isHom()) {
                            hom = true;
                        }
                    }
                    variants.add(new Variant((long) context.getStart(), ref, alt, hom));
                    found = true;
                }
            }
        }

        return variants;
    }

    private IntervalTreeIndex createIndex(String fileName, VCFCodec codec) throws IOException {
        File file = new File(fileName);
        IntervalTreeIndex intervalTreeIndex = IndexFactory.createIntervalIndex(file, codec); // Create an index

        File indexFile = new File(fileName + ".idx");
        IndexFactory.writeIndex(intervalTreeIndex, indexFile); // Write it to a file

        return intervalTreeIndex;
    }

    private String createTabixIndex(String fileName, VCFCodec codec, VCFFileReader reader) throws IOException {
        File file = new File(fileName);
        TabixIndex idx = IndexFactory.createTabixIndex(file, new VCFCodec(), TabixFormat.VCF, reader.getFileHeader().getSequenceDictionary());

        File indexFile = new File(fileName + ".tbi");
        idx.write(indexFile);

        return fileName + ".tbi";
    }
}
