package com.epam.gene.browser.d3.vo;

/**
 * Created with IntelliJ IDEA.
 * User: mmiroliubov
 * Date: 21.09.15
 * Time: 14:23
 */
public class BrowseRequest {
    private int from;
    private int to;
    private String chrId;

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getTo() {
        return to;
    }

    public void setTo(int to) {
        this.to = to;
    }

    public String getChrId() {
        return chrId;
    }

    public void setChrId(String chrId) {
        this.chrId = chrId;
    }
}
