package com.taager.allocation.capacity.commands.domain.contracts
import com.taager.allocation.capacity.commands.domain.models.aggregateroots.Province
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import org.springframework.stereotype.Repository
import java.util.*
@Repository
interface ProvinceRepo {
    fun getById(provinceId: ProvinceId): Optional<Province>
    fun save(province: Province)
}