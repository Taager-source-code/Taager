package com.taager.allocation.capacity.queries.application.contracts
import com.taager.allocation.capacity.queries.application.models.ProvincePriorityResponse
import com.taager.allocation.capacity.queries.application.models.ProvinceResponse
import com.taager.allocation.capacity.queries.application.models.ProvinceZonesResponse
import com.taager.allocation.capacity.queries.application.models.ZonePriorityResponse
import org.springframework.stereotype.Service
import java.util.*
@Service
interface ProvinceRepo {
    fun getAllProvinces(): List<ProvinceResponse>
    fun getAllZonesForProvince(provinceId: UUID): List<ProvinceZonesResponse>
    fun getShippingCompanyPrioritiesForProvince(provinceId: UUID): List<ProvincePriorityResponse>
    fun getShippingCompanyPrioritiesForZone(zoneId: UUID): List<ZonePriorityResponse>
}