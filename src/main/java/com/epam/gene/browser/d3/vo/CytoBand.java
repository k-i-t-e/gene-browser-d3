package com.epam.gene.browser.d3.vo;

/**
 * Created with IntelliJ IDEA.
 * User: mmiroliubov
 * Date: 12.10.15
 * Time: 16:30
 */
public class CytoBand {
    private String chr;
    private long start;
    private long end;
    private String name;
    private GiemsaStain stain;

    public String getChr() {
        return chr;
    }

    public void setChr(String chr) {
        this.chr = chr;
    }

    public long getStart() {
        return start;
    }

    public void setStart(long start) {
        this.start = start;
    }

    public long getEnd() {
        return end;
    }

    public void setEnd(long end) {
        this.end = end;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GiemsaStain getStain() {
        return stain;
    }

    public void setStain(GiemsaStain stain) {
        this.stain = stain;
    }
}
