package com.college.common.entity;

/**
 * Created by Hunter on 2020-07-09.
 */
public class LayUIPage {

    private int page = 1;
    private int limit = 10;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }
}
