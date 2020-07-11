package com.college.common.service.imp;

import com.college.common.entity.College;
import com.college.common.mapper.CollegeMapper;
import com.college.common.service.CollegeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Hunter on 2020-01-10.
 */
@Service
public class CollegeServiceImpl implements CollegeService {

    @Autowired
    private CollegeMapper collegeMapper;

    @Override
    public List<College> getList() {
        return collegeMapper.selectAll();
    }

    @Override
    public boolean addCollege(College college) {
        return collegeMapper.insertSelective(college) > 0 ? true : false;
    }
}
