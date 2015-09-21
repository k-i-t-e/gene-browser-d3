package com.epam.gene.browser.d3.vo;

/**
 * Created with IntelliJ IDEA.
 * User: mmiroliubov
 * Date: 18.09.15
 * Time: 15:15
 */
public class Variant {
    private Long position;
    private String ref;
    private String alt;

    public Variant(Long position, String ref, String alt) {
        this.position = position;
        this.ref = ref;
        this.alt = alt;
    }

    public Long getPosition() {
        return position;
    }

    public void setPosition(Long position) {
        this.position = position;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getAlt() {
        return alt;
    }

    public void setAlt(String alt) {
        this.alt = alt;
    }
}
