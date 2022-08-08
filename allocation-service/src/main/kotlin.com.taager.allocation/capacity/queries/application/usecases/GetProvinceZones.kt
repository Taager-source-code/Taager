package com.taager.allocation.capacity.queries.application.usecases
import com.taager.allocation.capacity.commands.domain.models.valueobjects.toUUIDOrThrow
import com.taager.allocation.capacity.queries.application.contracts.ProvinceRepo
import com.taager.allocation.capacity.queries.application.models.ProvinceZonesResponse
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class GetProvinceZones(val provinceRepo: ProvinceRepo): UseCase<String,List<ProvinceZonesResponse>>() {
    override fun execute(provinceId: String): List<ProvinceZonesResponse> {
        logger.debug("Get zones in a province with id of [$provinceId]")
        return provinceRepo.getAllZonesForProvince(provinceId.toUUIDOrThrow())
    }
}