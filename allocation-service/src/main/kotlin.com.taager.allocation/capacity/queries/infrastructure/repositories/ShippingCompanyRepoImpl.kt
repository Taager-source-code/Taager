package com.taager.allocation.capacity.queries.infrastructure.repositories
import com.taager.allocation.capacity.queries.application.contracts.ShippingCompanyRepo
import com.taager.allocation.capacity.queries.application.models.ShippingCompanyResponse
import com.taager.allocation.capacity.queries.infrastructure.db.access.ShippingCompanyDao
import org.springframework.stereotype.Service
@Service
class ShippingCompanyRepoImpl(
    val shippingCompanyDao: ShippingCompanyDao
) : ShippingCompanyRepo {
    override fun findAll(): List<ShippingCompanyResponse> {
        val shippingCompanyList = kotlin.runCatching { shippingCompanyDao.findAll() }.getOrNull() ?: emptyList()
        return shippingCompanyList.map { ShippingCompanyResponse(name = it.name, companyId = it.id) }
    }
}