import Cleave from "cleave.js";
// import { type CleaveOptions } from "cleave.js/options";

export class InputMask {
  /**
   * 1. Format Tiền tệ (VNĐ)
   * Tự động thêm dấu chấm phân cách hàng nghìn.
   * Ví dụ: 1000000 -> 1.000.000
   */
  static currency(selector: string | HTMLElement): Cleave {
    return new Cleave(selector, {
      numeral: true,
      numeralThousandsGroupStyle: "thousand",
      delimiter: ".",
      numeralDecimalScale: 0,
    });
  }

  /**
   * 2. Format Ngày tháng (DD/MM/YYYY)
   * Tự động thêm dấu gạch chéo.
   * Ví dụ: 12051990 -> 12/05/1990
   */
  static date(selector: string | HTMLElement): Cleave {
    return new Cleave(selector, {
      date: true,
      delimiter: "/",
      datePattern: ["d", "m", "Y"],
    });
  }

  /**
   * 3. Format Thẻ tín dụng (Credit Card)
   * Tự động chia nhóm 4 số.
   */
  static creditCard(selector: string | HTMLElement): Cleave {
    return new Cleave(selector, {
      creditCard: true,
    });
  }

  /**
   * 4. Format Số điện thoại (Cơ bản)
   * Chia nhóm: 4 số - 3 số - 3 số (hoặc tùy chỉnh)
   * Ví dụ: 0912 345 678
   */
  static phone(selector: string | HTMLElement): Cleave {
    return new Cleave(selector, {
      numericOnly: true,
      blocks: [4, 3, 3],
      delimiter: " ",
    });
  }

  /**
   * 5. Format Custom (Mã code, License key...)
   * Ví dụ mã đơn hàng: XXX-XXX-XXX (viết hoa)
   */
  static licenseKey(selector: string | HTMLElement): Cleave {
    return new Cleave(selector, {
      blocks: [3, 3, 3],
      delimiter: "-",
      uppercase: true,
    });
  }
}
