package com.hamzapaulpro.jobtracker.coverletter;

import com.hamzapaulpro.jobtracker.coverletter.dto.CoverLetterResponse;
import com.hamzapaulpro.jobtracker.coverletter.dto.CreateCoverLetterRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cover-letters")
public class CoverLetterController {

    private final CoverLetterService service;

    public CoverLetterController(CoverLetterService service) {
        this.service = service;
    }

    @PostMapping
    public CoverLetterResponse generate(
            @Valid @RequestBody CreateCoverLetterRequest request,
            @RequestHeader(name = "X-OpenAI-Api-Key", required = false) String apiKey) {
        return service.generate(request, apiKey);
    }
}
