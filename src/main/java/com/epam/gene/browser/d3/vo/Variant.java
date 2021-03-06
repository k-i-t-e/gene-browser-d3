package com.epam.gene.browser.d3.vo;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: mmiroliubov
 * Date: 18.09.15
 * Time: 15:15
 */
public class Variant {
    private Long position;
    private String ref;
    private List<String> alt;
    private Boolean hom;

    public Variant(Long position, String ref, List<String> alt, Boolean hom) {
        this.position = position;
        this.ref = ref;
        this.alt = alt;
        this.hom = hom;
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

    public List<String> getAlt() {
        return alt;
    }

    public void setAlt(List<String> alt) {
        this.alt = alt;
    }

    public Boolean getHom() {
        return hom;
    }

    public void setHom(Boolean hom) {
        this.hom = hom;
    }
}
