package com.epam.gene.browser.d3.controller;

import com.epam.gene.browser.d3.manager.CytoBandManager;
import com.epam.gene.browser.d3.manager.VCFManager;
import com.epam.gene.browser.d3.vo.BrowseRequest;
import com.epam.gene.browser.d3.vo.CytoBand;
import com.epam.gene.browser.d3.vo.Variant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: mmiroliubov
 * Date: 18.09.15
 * Time: 10:49
 */
@Controller
public class D3Controller {
    @Autowired
    private VCFManager vcfManager;

    @Autowired
    private CytoBandManager cytoBandManager;

    @RequestMapping(value = "reference", method = RequestMethod.GET)
    @ResponseBody
    public String getReference() throws IOException {
        return vcfManager.readReference();
    }

    @RequestMapping(value = "variants", method = RequestMethod.POST)
    @ResponseBody
    public List<Variant> getVariants(@RequestBody BrowseRequest request) throws IOException {
        return vcfManager.readVcf(request);
    }

    @RequestMapping(value = "bands", method = RequestMethod.GET)
    @ResponseBody
    public List<CytoBand> getCytoBands(@RequestParam String chr) throws IOException {
        return cytoBandManager.readCytoBand(chr); //"chrA1"
    }
}
