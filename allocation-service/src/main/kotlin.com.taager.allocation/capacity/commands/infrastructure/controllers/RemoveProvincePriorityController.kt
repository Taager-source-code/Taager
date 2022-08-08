package com.taager.allocation.capacity.commands.infrastructure.controllers
import com.taager.allocation.capacity.commands.application.usecases.DeleteProvincePriority
import com.taager.allocation.capacity.commands.infrastructure.controllers.converters.RemovePriorityConverter
import com.taager.allocation.openapi.api.RemoveProvincePriorityApi
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class RemoveProvincePriorityController(
    private val converter: RemovePriorityConverter,
    private val deleteProvincePriority: DeleteProvincePriority,
) : RemoveProvincePriorityApi {
    override fun removeProvincePriority(
        provinceId: String,
        priorityId: String,
    ): ResponseEntity<Unit> {
        val removeProvincePriorityRequest = converter.convert(provinceId, priorityId)
        deleteProvincePriority.execute(removeProvincePriorityRequest)
        return ResponseEntity(HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [RemoveProvincePriorityController::class])
class RemoveProvincePriorityControllerAdvice {}
