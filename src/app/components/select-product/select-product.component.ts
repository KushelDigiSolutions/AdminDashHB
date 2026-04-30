import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EcommerceService } from 'src/app/pages/ecommerce/ecommerce.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss']
})
export class SelectProductComponent implements OnInit {

  @Output() addproduct = new EventEmitter();

  imageUrl = environment.imageUrl;

  productList: any[] = [];
  selectedProduct: any;
  qty = 1;

  constructor(
    private api: EcommerceService,
  ) { }

  ngOnInit(): void {
  }

  searchProducts(event) {
    console.log();
    let { value } = event.target;
    this.productList
    if (value && value.trim()) {
      this.api.algoliaSearch(value.trim()).subscribe(res => {
        if (res.success) {
          this.productList = res.data1.hits;
        }
      }, err => {

      });
    }
  }

  onSelectProduct(event) {
    if (!event) return;
    console.log(event);
    this.qty = 1;
    let product = JSON.parse(JSON.stringify(event));
    this.selectedProduct = product;

    if (product.type == 'Normal' && product.variations.length) {
      product.variations.sort((a, b) => (a.price.minPrice || a.price.mrp) - (b.price.minPrice || a.price.mrp));
      let variation = product.variations[0];
      // product._id = variation.productId;
      // product.price = variation.price;
      // product.weight = variation.weight;
      // product.slug = variation.slug;
    }
    if (product.mainVariations.length && product.variations.length) {
      product.mainVariations = product.mainVariations.filter(el => !!el.values.length)
      product.variations = product.variations.filter(el => !!el.label.length)
      if (product.mainVariations.length && product.variations.length) {
        let maxGroupSize = product.mainVariations.map(el => el.values.length).reduce((total, el) => total * el) || 0;

        this.addTitleInVariations(product);

        if (product.variations.length != maxGroupSize) {
          product.variationsStructureType = 'group'
        } else {
          product.variationsStructureType = 'single'
        }

        console.log('[maxGroupSize]', maxGroupSize, product.variations.length, product.variations);
        this.makeDefaultVariantsSelected(product);
      }

    }


  }

  makeDefaultVariantsSelected(product) {
    if (!product.mainVariations.length || !product.variations.length) return;

    let currentGroup = product.variations.find(el => '/' + product.slug == el.url);

    if (currentGroup) { /** if product type is variant */
      currentGroup.isSelected = true;
      let labelArr = currentGroup.label;
      labelArr.forEach(label => {
        product.mainVariations.forEach(el => {
          let index = el.values.indexOf(label)
          if (index != -1) {
            el.selectedIndex = index;
          }
        });
      })
      product.selectedVariation = currentGroup;
    } else { /** if product type is normal */
      product.variations[0].isSelected = true;
      let selectedValue = [];

      let labelArr = product.variations[0].label;
      labelArr.forEach(label => {
        product.mainVariations.forEach(el => {
          let index = el.values.indexOf(label)
          if (index != -1) {
            el.selectedIndex = index;
            selectedValue.push(el.values[index])
          }
        });
      })

      // product.mainVariations.forEach(el => {
      //   selectedValue.push(el.values[0])
      //   el.selectedIndex = 0;
      // });

      if (product.variationsStructureType == 'group') {
        var group = product.variations[0]
      } else {
        group = product.variations.find(el => this.checkIsSameGroup(selectedValue, el.label))
      }
      product.selectedVariation = group;
      product = {
        ...product,
        _id: group.productId,
        weight: group.weight,
        price: group.price,
        slug: group.slug,
        stock: group.stock,
        noOfProductSold: group.noOfProductSold,
      }
      this.selectedProduct = { ...product };
    }
  }
  addTitleInVariations(product) {
    if (!(product.variations && product.mainVariations)) return;
    product.variations.forEach(el => {
      el.title = [];
      el.label.forEach(label => {
        product.mainVariations.forEach(mVariation => {
          if (typeof mVariation.variationId != 'object')
            console.error("Custom Error: Cannot read property 'title' of variationId");
          if (mVariation.values.includes(label)) {
            el.title.push(mVariation.variationId.title || "Unknown")
          }
        });
      });
    });
  }

  checkIsSameGroup(values1: string[], values2: string[]): boolean {
    let set = new Set();
    values1.forEach(el => set.add(el));
    values2.forEach(el => set.add(el));
    return values1.length == set.size;
  }

  selectVariation(product, variation, index?) {
    let selectedVariation;
    if (product.variationsStructureType == 'group') {
      product.variations.forEach(el => {
        el.isSelected = false;
      });
      variation.isSelected = true;
      selectedVariation = variation;
    } else {
      variation.selectedIndex = index;
      let selectedValues = [];
      product.mainVariations.forEach(mVariation => {
        selectedValues.push(mVariation.values[mVariation.selectedIndex]);
      });

      selectedVariation = product.variations.find(el => this.checkIsSameGroup(selectedValues, el.label));
    }

    product = {
      ...product,
      _id: selectedVariation.productId,
      weight: selectedVariation.weight,
      price: selectedVariation.price,
      slug: selectedVariation.slug,
      stock: selectedVariation.stock,
      noOfProductSold: selectedVariation.noOfProductSold,
      selectedVariation,
    }
    this.selectedProduct = product;
    console.log(this.selectedProduct);

  }

  changeQty(type) {
    if (type == 'plus') {
      this.qty += 1;
    } else {
      if (this.qty == 1) return;
      this.qty -= 1;
    }
  }

  addProduct() {
    this.addproduct.emit({
      product: this.selectedProduct,
      qty: this.qty
    });
  }

}
