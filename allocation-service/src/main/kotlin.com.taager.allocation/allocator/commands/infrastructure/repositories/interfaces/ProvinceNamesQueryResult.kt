package com.taager.allocation.allocator.commands.infrastructure.repositories.interfaces
interface ProvinceNamesQueryResult {
    fun getProvinceName(): String
    fun getZoneId(): String
}