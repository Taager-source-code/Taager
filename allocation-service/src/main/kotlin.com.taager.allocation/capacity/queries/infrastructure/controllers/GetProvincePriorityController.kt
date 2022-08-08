package com.taager.allocation.capacity.queries.infrastructure.controllers
import com.taager.allocation.capacity.queries.application.usecases.GetProvincePriorities
import com.taager.allocation.capacity.queries.infrastructure.converters.ProvincePrioritiesConverter
import com.taager.allocation.openapi.api.GetProvincePriorityApi
import com.taager.allocation.openapi.model.ProvincePriorityDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import javax.validation.constraints.NotBlank
@RestController
class GetProvincePriorityController(
    private val getProvincePriorities: GetProvincePriorities,
    private val converter: ProvincePrioritiesConverter,
) : GetProvincePriorityApi {
    override fun getProvincePriorities(@NotBlank  provinceId: String): ResponseEntity<List<ProvincePriorityDTO>> {
        val provincePriorities = getProvincePriorities.execute(provinceId)
        val provincePrioritiesDTOs = provincePriorities.map { converter.convert(it) }
        return ResponseEntity(provincePrioritiesDTOs, HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [GetProvincePriorityController::class])
class GetProvincePriorityControllerAdvice {}
