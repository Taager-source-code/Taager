package com.taager.allocation.capacity.queries.application.usecases
import com.taager.allocation.capacity.queries.application.contracts.ProvinceRepo
import com.taager.allocation.capacity.queries.application.models.ProvinceResponse
import com.taager.allocation.sharedkernel.application.UseCaseWithoutRequest
import org.springframework.stereotype.Service
@Service
class GetProvinces(val provinceRepo: ProvinceRepo): UseCaseWithoutRequest<List<ProvinceResponse>>() {
    override fun execute(): List<ProvinceResponse> {
        logger.debug("Get all provinces")
        return provinceRepo.getAllProvinces();
    }
}
