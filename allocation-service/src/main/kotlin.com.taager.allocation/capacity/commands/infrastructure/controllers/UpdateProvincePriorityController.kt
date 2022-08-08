package com.taager.allocation.capacity.commands.infrastructure.controllers
import com.taager.allocation.capacity.commands.application.usecases.UpdateProvincePriority
import com.taager.allocation.capacity.commands.infrastructure.controllers.converters.UpdatePriorityConverter
import com.taager.allocation.openapi.api.UpdateProvincePriorityApi
import com.taager.allocation.openapi.model.UpdateProvincePriorityDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class UpdateProvincePriorityController(
    private val converter: UpdatePriorityConverter,
    private val updateProvincePriority: UpdateProvincePriority
) : UpdateProvincePriorityApi {
    override fun updateProvincePriorityCapcityOrTime(
        provinceId: String,
        priorityId: String,
        updateProvincePriorityDTO: UpdateProvincePriorityDTO
    ): ResponseEntity<Unit> {
        val updateProvincePriorityRequest = converter.convert(provinceId, priorityId, updateProvincePriorityDTO)
        updateProvincePriority.execute(updateProvincePriorityRequest)
        return ResponseEntity(HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [UpdateProvincePriorityController::class])
class UpdateProvincePriorityControllerAdvice {}