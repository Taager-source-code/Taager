package com.taager.allocation.capacity.commands.infrastructure.repositories
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.models.aggregateroots.Province
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.capacity.commands.infrastructure.db.access.ProvinceDao
import com.taager.allocation.capacity.commands.infrastructure.db.access.ZoneDao
import com.taager.allocation.capacity.commands.infrastructure.db.converters.ProvinceToDbConverter
import com.taager.allocation.capacity.commands.infrastructure.db.converters.ProvinceToDomainConverter
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
@Service
class ProvinceRepoImpl(
    val provinceDao: ProvinceDao,
    val zoneDao: ZoneDao,
    private val toDomainConverter: ProvinceToDomainConverter,
    private val toDbConverter: ProvinceToDbConverter
) :
    ProvinceRepo {
    @Transactional(readOnly = true)
    override fun getById(provinceId: ProvinceId): Optional<Province> {
        val provinceDbo = provinceDao.findById(provinceId.value)
        val remainingProvinceCapacitiesMap = provinceDao.findRemainingCapacities()
            .filter { it.getProvinceId() == provinceId.value.toString() }
            .associate { it.getPriorityId() to it.getRemainingCapacity() }
        val remainingZonesCapacities = zoneDao.findRemainingCapacities()
        return provinceDbo.map { toDomainConverter.convert(it, remainingProvinceCapacitiesMap, remainingZonesCapacities) }
    }
    override fun save(province: Province) {
        val provinceDbo = toDbConverter.convert(province)
        provinceDao.save(provinceDbo)
    }
}