import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

import { UserService } from "../../services/user.service";
import { Gallery, GalleryRef } from "ng-gallery";

@Component({
  selector: "app-add-announcement",
  templateUrl: "./add-announcement.component.html",
  styleUrls: ["./add-announcement.component.scss"],
})
export class AddAnnouncementComponent implements OnInit {
  public ready = false;
  public selectedCountry: string;
  public id = 1;
  public currIndex = 0;
  public formsArray = [{ id: 1, name: "mainpic", label: "" }];
  public imgArray = [{ img: "", isMobile: false, link: "" }];
  public savedImgArray = [];
  public galleryId = "announce";
  isMobile: boolean;

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private gallery: Gallery,
    public dialogRef: MatDialogRef<AddAnnouncementComponent>
  ) {}

  ngOnInit(): void {}

  galleryImageChanged(index) {
    this.currIndex = index.currIndex;
  }

  addImg() {
    this.id++;
    this.ready = false;
    this.formsArray.push({
      id: this.id,
      name: "pic" + this.id,
      label: "",
    });
    this.imgArray.push({
      img: "",
      isMobile: false,
      link: "",
    });
  }

  createGallery(element): void {
    const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
    galleryRef.addImage({
      src: element.img,
    });
  }

  getAnnouncements(): void {
    this.savedImgArray = [];
    this.userService
      .getAnnouncement(this.selectedCountry)
      .subscribe((res: any) => {
        res.data.forEach((element, index) => {
          element.desc = "Image " + (index + 1);
          this.savedImgArray.push(element);
          this.createGallery(element);
        });
      });
  }

  onSendFile(event) {
    this.toastr.info("Uploading file");

    const {
      target: { name, files },
    } = event;
    var file: File = files[0];

    this.formsArray.forEach((item) => {
      if (item.name === name) {
        item.label = file.name;
      }
    });

    const formData = new FormData();
    formData.append("image", file);
    this.userService.addImage(formData).subscribe(
      (resp: any) => {
        this.toastr.success("Uploaded file");
        this.imgArray[event.srcElement.id - 1].img = resp.msg;
        this.ready = true;
      },
      (err) => {
        this.toastr.error(err.error.msg);
      }
    );
  }

  isMobileCheck(event, idx) {
    if (event.checked) {
      this.imgArray[idx].isMobile = true;
    } else {
      this.imgArray[idx].isMobile = false;
    }
  }

  onDelete() {
    const id = this.savedImgArray[this.currIndex]._id;
    this.userService.deleteAnnouncement(id).subscribe(
      (resp: any) => {
        this.toastr.success("Deleted");
        this.getAnnouncements();
      },
      (err) => {
        this.toastr.error(err.error.msg);
      }
    );
  }

  onRegister() {
    this.imgArray.forEach((element) => {
      if (element.img) {
        const announcementInfo = {
          country: this.selectedCountry,
          img: element.img,
          isMobile: element.isMobile,
          link: element.link,
        };

        this.userService.addAnnouncement(announcementInfo).subscribe(
          (response: any) => {
            this.dialogRef.close();
            this.toastr.success(response.msg);
            this.dialogRef.close();
          },
          (err) => {
            this.toastr.error(err.error.msg);
          }
        );
      }
    });
  }

  getSelectedCountry(value) {
    this.selectedCountry = value;
    this.getAnnouncements();
  }
}
