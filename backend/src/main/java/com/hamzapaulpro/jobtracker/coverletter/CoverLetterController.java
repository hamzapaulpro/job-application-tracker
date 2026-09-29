package com.hamzapaulpro.jobtracker.coverletter;

import com.hamzapaulpro.jobtracker.coverletter.dto.CoverLetterResponse;
import com.hamzapaulpro.jobtracker.coverletter.dto.CreateCoverLetterRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cover-letters")
public class CoverLetterController {

    private final CoverLetterService service;

    public CoverLetterController(CoverLetterService service) {
        this.service = service;
    }

    @PostMapping
    public CoverLetterResponse generate(@Valid @RequestBody CreateCoverLetterRequest request) {
        return service.generate(request);
    }
}
