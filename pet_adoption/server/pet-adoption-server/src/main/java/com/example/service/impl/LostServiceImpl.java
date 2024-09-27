package com.example.service.impl;

import com.example.entity.Lost;
import com.example.service.ILostService;
import com.example.mapper.LostMapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author
 * @since 2022-04-04
 */
@Service
public class LostServiceImpl extends ServiceImpl<LostMapper, Lost> implements ILostService {

}
