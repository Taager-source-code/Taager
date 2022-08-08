package com.taager.allocation.capacity.commands.infrastructure.controllers
import com.taager.allocation.capacity.commands.application.usecases.ReSortProvincePriorities
import com.taager.allocation.capacity.commands.infrastructure.controllers.converters.ResortPriorityConverter
import com.taager.allocation.openapi.api.ReSortProvincePrioritiesApi
import com.taager.allocation.openapi.model.ReSortProvincePrioritiesDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class ReSortProvincePrioritiesController(
    private val converter: ResortPriorityConverter,
    private val reSortProvincePriorities: ReSortProvincePriorities,
) : ReSortProvincePrioritiesApi {
    override fun reSortProvincePriorities(
        provinceId: String,
        reSortProvincePrioritiesDTO: ReSortProvincePrioritiesDTO
    ): ResponseEntity<Unit> {
        val reSortProvincePrioritiesRequest = converter.convert(provinceId, reSortProvincePrioritiesDTO)
        reSortProvincePriorities.execute(reSortProvincePrioritiesRequest)
        return ResponseEntity(HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [ReSortProvincePrioritiesController::class])
class ReSortProvincePrioritiesControllerAdvice {}
