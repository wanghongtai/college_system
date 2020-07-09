package com.college.common.service;

import com.college.common.entity.College;

import java.util.List;

/**
 * Created by Hunter on 2020-01-10.
 */
public interface CollegeService {

    public List<College> getList();


    public boolean addCollege(College college);

}
