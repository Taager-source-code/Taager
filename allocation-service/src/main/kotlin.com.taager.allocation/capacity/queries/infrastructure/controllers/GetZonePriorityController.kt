package com.taager.allocation.capacity.queries.infrastructure.controllers
import com.taager.allocation.capacity.queries.application.models.GetZonePrioritiesQuery
import com.taager.allocation.capacity.queries.application.usecases.GetZonePriorities
import com.taager.allocation.capacity.queries.infrastructure.converters.ZonePrioritiesConverter
import com.taager.allocation.openapi.api.GetZonePriorityApi
import com.taager.allocation.openapi.model.ZonePriorityDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import javax.validation.constraints.NotBlank
@RestController
class GetZonePriorityController(
    private val getZonePriorities: GetZonePriorities,
    private val converter: ZonePrioritiesConverter,
) : GetZonePriorityApi {
    override fun getZonePriorities(@NotBlank provinceId: String, @NotBlank zoneId: String)
    : ResponseEntity<List<ZonePriorityDTO>> {
        val zonePriorities = getZonePriorities.execute(GetZonePrioritiesQuery(provinceId = provinceId, zoneId = zoneId))
        val zonePrioritiesDTOs = zonePriorities.map { converter.convert(it) }
        return ResponseEntity(zonePrioritiesDTOs, HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [GetZonePriorityController::class])
class GetZonePriorityControllerAdvice {}