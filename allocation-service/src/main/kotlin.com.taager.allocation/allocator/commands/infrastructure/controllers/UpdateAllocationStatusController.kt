package com.taager.allocation.allocator.commands.infrastructure.controllers
import com.taager.allocation.allocator.commands.application.usecases.UpdateAllocationStatus
import com.taager.allocation.allocator.commands.domain.exceptions.AllocatorConfigNotFoundException
import com.taager.allocation.allocator.commands.domain.exceptions.InvalidAllocationStatusException
import com.taager.allocation.allocator.commands.infrastructure.controllers.converters.UpdateAllocationConfigConverter
import com.taager.allocation.openapi.api.UpdateAllocationStatusApi
import com.taager.allocation.openapi.model.AllocatorStatusDTO
import com.taager.allocation.openapi.model.ErrorDto
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalTime
@RestController
class UpdateAllocationStatusController(private val updateAllocationStatus: UpdateAllocationStatus, private val converter: UpdateAllocationConfigConverter): UpdateAllocationStatusApi {
    override fun updateAllocationStatus(allocatorStatusDTO: AllocatorStatusDTO): ResponseEntity<Unit> {
        updateAllocationStatus.execute(converter.convert(allocatorStatusDTO))
        return ResponseEntity(HttpStatus.OK)
    }
}
@RestControllerAdvice(basePackageClasses = [UpdateAllocationStatusController::class])
class UpdateAllocationStatusControllerAdvice {
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(AllocatorConfigNotFoundException::class)
    fun allocatorConfigNotFound(allocatorConfigNotFoundException: AllocatorConfigNotFoundException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = allocatorConfigNotFoundException.message
            ),
            HttpStatus.NOT_FOUND
        )
    }
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidAllocationStatusException::class)
    fun allocatorConfigNotFound(invalidAllocationStatusException: InvalidAllocationStatusException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = invalidAllocationStatusException.message
            ),
            HttpStatus.BAD_REQUEST
        )
    }
}
