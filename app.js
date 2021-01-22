Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
        // details: {

        // }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img class="img-socks" v-bind:src="image" width="150px" alt="">
        </div>
        <div class="product-info">
            <h1>{{ onSale }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <p>Shipping: {{shipping}} </p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
            <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
                :style="{backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">
            </div>
            <div>
                <button v-for="(size) in sizes">{{ size }}</button>
            </div>
            <div>
                <button v-on:click="addToCart" :disabled="!inStock" :class="[!inStock ? disabledButton : '']">
                    Add to cart
                </button>
                <button @click="deleteFromCart" :disabled="!inStock" :class="[!inStock ? disabledButton : '']">
                    Deleted from cart
                </button>
            </div>
            
            <product-review></product-review>
        </div>
    </div>
    `,
    data() {
        return {
            brand: "Vue Mastery",
            product: 'Socks',
            sizes: ["small", "big"],
            selectedVariant: 0,
            disabledButton: ".disabledButton",
            details: ["80% cotton", "20% polyester", "Gender - neutral"],
            variants: [{
                    variantId: 2234,
                    variantColor: "black",
                    variantImage: "https://conteshop.ru/media/catalog/product/cache/11/image/1405x1879/602f0fa2c1f0d1ba5e241f914e856ff9/c/7/c7d5fc0e9a2f319abd451102ad56b610.jpg",
                    variantQuantity: 10,
                    sale: 1,
                },
                {
                    variantId: 2235,
                    variantColor: "pink",
                    variantImage: "https://cosmosocks.ru/image/cache/catalog/noski/artikuly/nadpisi/csn25sexno/noski36-800x800.jpg",
                    variantQuantity: 0,
                    sale: 0,
                },
            ],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        deleteFromCart() {
            this.$emit('delete-from-cart');
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free"
            } else {
                return 2.29;
            }
        },
        onSale() {
            console.log(`read: ${this.variants[this.selectedVariant].sale}`);
            if (this.variants[this.selectedVariant].sale == true) {
                return this.brand + " " + this.product + " " + "!Sale!"
            } else {
                return this.title;
            }

        }
    },
});

Vue.component('product-review', {
    template: `
        <input v-model="name">
    `,
    data(){
        return {
            name: null
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        updateCartAgan() {
            this.cart.pop();
        },
    },
})