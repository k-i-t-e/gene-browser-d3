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
    private int width;
    private boolean bigZoom;

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

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public boolean isBigZoom() {
        return bigZoom;
    }

    public void setBigZoom(boolean bigZoom) {
        this.bigZoom = bigZoom;
    }
}
