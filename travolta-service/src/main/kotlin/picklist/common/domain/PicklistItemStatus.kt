package com.taager.travolta.picklist.common.domain.models
enum class PicklistItemStatus(val value: String) {
    PENDING("PENDING"),
    PICKED("PICKED"),
    PARTIALLY_PICKED("PARTIALLY_PICKED"),
    NOT_FOUND("NOT_FOUND")
}