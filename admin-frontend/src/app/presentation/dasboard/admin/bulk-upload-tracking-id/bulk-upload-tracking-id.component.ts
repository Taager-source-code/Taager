import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import {
  exportCancelledFields,
  exportCreatedFields,
  exportDeliveredFields,
  exportUpdatedFields,
  ORDER_SHIPMENT_CANCELLED,
  ORDER_SHIPMENT_CREATED_STATUS,
  ORDER_SHIPMENT_DELIVERED,
  ORDER_SHIPMENT_REVERT,
  ORDER_SHIPMENT_STATUS_LIST,
} from "../../../shared/constants";
import { shippingCompanies } from "../../../shared/constants/shipping-companies";
import {
  FILE_NOT_UTF_8_ERROR_MESSAGE,
  MISSING_SHIPPING_COMPANY_ERROR,
} from "../../../shared/constants/toaster-messages";
import { TRACKING_ID } from "../../../shared/constants/upload-type";
import { DownloadTemplateService } from "../../services/download-template.app.service";
import { ShippingService } from "../../services/shipping.service";
import { UtilityService } from "../../services/utility.service";
import { ConfirmFileUploadDialogComponent } from "../confirm-file-upload-dialog/confirm-file-upload-dialog.component";
@Component({
  selector: "app-bulk-upload-tracking-id",
  templateUrl: "./bulk-upload-tracking-id.component.html",
  styleUrls: ["./bulk-upload-tracking-id.component.scss"],
})
export class BulkUploadTrackingIdComponent implements OnInit {
  public selectedCountry: string = "";
  public selectedUploadStatus: string = "";
  public statusList: { name: string; value: string }[] =
    ORDER_SHIPMENT_STATUS_LIST;
  public exportCreatedFields = exportCreatedFields;
  public exportUpdatedFields = exportUpdatedFields;
  public exportCancelledFields = exportCancelledFields;
  public exportDeliveredFields = exportDeliveredFields;
  public selectedShippingCompany: string = "";
  public createdStatus = ORDER_SHIPMENT_CREATED_STATUS;
  shippingCompanies: { name: string; value: string }[];

  constructor(
    private DownloadTemplateService: DownloadTemplateService,
    private toastr: ToastrService,
    private utilityService: UtilityService,
    private spinner: NgxSpinnerService,
    private shippingService: ShippingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.shippingCompanies = shippingCompanies;
  }

  getSelectedCountry(country: string) {
    this.selectedCountry = country;
  }

  downloadTemplate() {
    let data = [
      {
        orderId: "",
        trackingNumber: "",
        createdAt: "",
        updatedAt: "",
        reason: "",
      },
    ];
    let filename = "Bulk Upload";

    if (this.selectedUploadStatus === ORDER_SHIPMENT_CREATED_STATUS) {
      this.DownloadTemplateService.downloadFile(
        data,
        filename,
        this.exportCreatedFields
      );
    } else {
      if (this.selectedUploadStatus === ORDER_SHIPMENT_CANCELLED) {
        this.DownloadTemplateService.downloadFile(
          data,
          filename,
          this.exportCancelledFields
        );
      } else if (this.selectedUploadStatus === ORDER_SHIPMENT_DELIVERED) {
        this.DownloadTemplateService.downloadFile(
          data,
          filename,
          this.exportDeliveredFields
        );
      } else {
        this.DownloadTemplateService.downloadFile(
          data,
          filename,
          this.exportUpdatedFields
        );
      }
    }
  }
  confirmFileUpload(event) {
    if (
      this.selectedShippingCompany === "" &&
      this.selectedUploadStatus === ORDER_SHIPMENT_CREATED_STATUS
    ) {
      this.toastr.error(MISSING_SHIPPING_COMPANY_ERROR);
    } else {
      const file = event.currentTarget.files[0];
      this.utilityService
        .detectEncoding(event.currentTarget.files[0])
        .subscribe((encoding) => {
          if (encoding !== "UTF8") {
            this.toastr.error(FILE_NOT_UTF_8_ERROR_MESSAGE);
          } else {
            let fileData = {
              file,
              uploadType: TRACKING_ID,
              statusType: this.selectedUploadStatus,
              shippingCompany: this.selectedShippingCompany,
            };
            const dialogRef = this.dialog.open(
              ConfirmFileUploadDialogComponent,
              {
                width: "600px",
                data: fileData,
              }
            );
            dialogRef.afterClosed().subscribe((result) => {
              if (result.type === "confirm") {
                this.onFileUpload(result.headers, result.data);
              }
            });
          }
        });
    }
  }
  onFileUpload(headers, orders) {
    if (this.selectedUploadStatus === ORDER_SHIPMENT_CREATED_STATUS) {
      this.createShipments(headers, orders);
    } else if (this.selectedUploadStatus === ORDER_SHIPMENT_REVERT) {
      this.revertShipments(headers, orders);
    } else {
      this.updateShipments(headers, orders);
    }
  }

  createShipments(headers, orders) {
    if (headers.length !== this.exportCreatedFields.length) {
      this.headerError();
    } else {
      const shipmentsRequestDto = {
        orders: orders,
        shippingCompany: this.selectedShippingCompany,
        country: this.selectedCountry,
      };
      this.spinner.show();
      this.shippingService
        .createShipmentsTrackingIDs(shipmentsRequestDto)
        .subscribe(
          (res: any) => {
            this.spinner.hide();
            this.toastr.success(
              res.data.description +
                " , failed: " +
                res.data.failedShipments.length
            );
            if (res.data.failedShipments.length > 0) {
              this.DownloadTemplateService.downloadPayloadResponse(
                res.data,
                "download response -" + new Date().getTime()
              );
            }
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error(
              err.error?.data?.description || err.error?.description
            );
          }
        );
    }
  }

  updateShipments(headers, orders) {
    if (
      (this.selectedUploadStatus === ORDER_SHIPMENT_DELIVERED &&
        headers.length !== this.exportDeliveredFields.length) ||
      (this.selectedUploadStatus === ORDER_SHIPMENT_CANCELLED &&
        headers.length !== this.exportCancelledFields.length) ||
      (this.selectedUploadStatus !== ORDER_SHIPMENT_CANCELLED &&
        this.selectedUploadStatus !== ORDER_SHIPMENT_DELIVERED &&
        headers.length !== this.exportUpdatedFields.length)
    ) {
      this.headerError();
    } else {
      const shipmentsRequestDto = {
        shipments: orders,
        status: this.selectedUploadStatus,
      };
      this.spinner.show();
      this.shippingService
        .updateShipmentsTrackingIDs(shipmentsRequestDto)
        .subscribe(
          (res: any) => {
            this.spinner.hide();
            this.toastr.success(
              "updated: " +
                res.data.successShipments.length +
                " , failed: " +
                res.data.failedShipments.length
            );
            if (res.data.failedShipments.length > 0) {
              this.DownloadTemplateService.downloadPayloadResponse(
                res.data,
                "download response -" + new Date().getTime()
              );
            }
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error(err.error?.description);
          }
        );
    }
  }
  revertShipments(headers, orders) {
    if (headers.length !== this.exportUpdatedFields.length) {
      this.headerError();
    } else {
      const revertedShipments = {
        shipments: orders,
      };
      this.spinner.show();
      this.shippingService
        .revertShipmentsTrackingIDs(revertedShipments)
        .subscribe(
          (res: any) => {
            this.spinner.hide();
            this.toastr.success(
              "reverted: " +
                res.data.successShipments.length +
                " , failed: " +
                res.data.failedShipments.length
            );
            if (res.data.failedShipments.length > 0) {
              this.DownloadTemplateService.downloadPayloadResponse(
                res.data,
                "download response -" + new Date().getTime()
              );
            }
          },
          (err) => {
            this.spinner.hide();
            this.toastr.error(err.error?.description);
          }
        );
    }
  }
  headerError() {
    this.toastr.error("ØªÙ†Ø³ÙŠÙ‚ Ù…Ù„Ù ØºÙŠØ± ØµØ§Ù„Ø­ (Ø£Ø¹Ù…Ø¯Ø© Ù…ÙÙ‚ÙˆØ¯Ø©)");
    this.spinner.hide();
  }
}
