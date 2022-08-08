package com.taager.allocation.sharedkernel.infrastructure.controller
import com.taager.allocation.AllocationServiceApplication
import com.taager.allocation.capacity.commands.domain.exceptions.InvalidInputException
import com.taager.allocation.capacity.commands.domain.exceptions.NotFoundException
import com.taager.allocation.capacity.commands.domain.exceptions.RequirementException
import com.taager.allocation.openapi.model.ErrorDto
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalTime
@RestControllerAdvice(basePackageClasses = [AllocationServiceApplication::class])
class CommonControllerAdvice {
    private val log = LoggerFactory.getLogger(CommonControllerAdvice::class.java)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException::class)
    fun resourceNotFound(notFoundException: NotFoundException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = notFoundException.message,
            ),
            HttpStatus.NOT_FOUND
        )
    }
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun requestBodyInvalid(httpMessageNotReadableException: HttpMessageNotReadableException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = httpMessageNotReadableException.message
            ),
            HttpStatus.BAD_REQUEST
        )
    }
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidInputException::class)
    fun invalidId(invalidInputException: InvalidInputException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = invalidInputException.message
            ),
            HttpStatus.BAD_REQUEST
        )
    }
    @ResponseStatus(value = HttpStatus.CONFLICT)
    @ExceptionHandler(RequirementException::class)
    fun priorityAlreadyPresent(requirementException: RequirementException): ResponseEntity<ErrorDto> {
        return ResponseEntity(
            ErrorDto(
                timestamp = LocalTime.now().toString(),
                message = requirementException.message
            ),
            HttpStatus.CONFLICT
        )
    }
}