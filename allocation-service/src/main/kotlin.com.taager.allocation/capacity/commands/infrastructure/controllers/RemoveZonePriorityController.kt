package com.taager.allocation.capacity.commands.infrastructure.controllers
import com.taager.allocation.capacity.commands.application.usecases.DeleteZonePriority
import com.taager.allocation.capacity.commands.infrastructure.controllers.converters.RemovePriorityConverter
import com.taager.allocation.openapi.api.RemoveZonePriorityApi
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class RemoveZonePriorityController(
    private val converter: RemovePriorityConverter,
    private val deleteZonePriority: DeleteZonePriority
) : RemoveZonePriorityApi {
    override fun removeZonePriority(
        provinceId: String,
        zoneId: String,
        priorityId: String
    ): ResponseEntity<Unit> {
        val removeZonePriorityRequest = converter.convert(provinceId, zoneId, priorityId)
        deleteZonePriority.execute(removeZonePriorityRequest)
        return ResponseEntity(HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [RemoveZonePriorityController::class])
class RemoveZonePriorityControllerAdvice {}
