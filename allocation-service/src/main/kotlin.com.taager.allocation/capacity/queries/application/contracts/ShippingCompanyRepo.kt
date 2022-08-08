package com.taager.allocation.capacity.queries.application.contracts
import com.taager.allocation.capacity.queries.application.models.ShippingCompanyResponse
import org.springframework.stereotype.Service
@Service
interface ShippingCompanyRepo {
    fun findAll(): List<ShippingCompanyResponse>
}