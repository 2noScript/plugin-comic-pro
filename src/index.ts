import { type_supplier } from "./models/types";
import { Nettruyen } from "./plugin";

import { comicSuppliers } from "./constants/suppliers";

export class Comic {
  constructor() {}
  build(supplier: type_supplier) {
    switch (supplier.name) {
      case "nettruyen":
        return new Nettruyen(supplier.source);
      // case "truyenqq":
      //   return new TruyenQQ(supplier.source);
    }
  }
}

const cm = new Comic().build(comicSuppliers.NETTRUYEN);
