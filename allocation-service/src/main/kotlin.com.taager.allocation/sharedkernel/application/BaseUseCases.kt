package com.taager.allocation.sharedkernel.application
import org.slf4j.Logger
import org.slf4j.LoggerFactory
abstract class UseCase<T, R> {
    protected val logger: Logger = LoggerFactory.getLogger(this::class.java)
    abstract fun execute(request: T): R
}
abstract class UseCaseWithoutRequest<R> {
    protected val logger: Logger = LoggerFactory.getLogger(this::class.java)
    abstract fun execute(): R
}
abstract class EventHandler<T, R> {
    protected val logger: Logger = LoggerFactory.getLogger(this::class.java)
    abstract fun handle(event: T): R
}