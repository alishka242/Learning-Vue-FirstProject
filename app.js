let eventBus = new Vue();

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
        </div>

        <product-tabs :reviews="reviews"></product-tabs>
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
            reviews: [],
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
            if (this.variants[this.selectedVariant].sale == true) {
                return this.brand + " " + this.product + " " + "!Sale!"
            } else {
                return this.title;
            }

        }
    },
    mounted(){
        eventBus.$on('review-submitted', productReview =>{
            this.reviews.push(productReview);
        });
    }
});

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s): </b>
                <ul>
                    <li v-for="error in errors">{{error}}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>

            <p>
                <label for="review">Review:</label>      
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <div class="recommend"> 
                <p>Would you recommend this product</p>
                <div>
                    <input type="radio" name="recommend" v-model="recommend" value="Yes">Yes
                    <input type="radio" name="recommend" v-model="recommend" value="No">No    
                </div>
            </div>
                
            <p>
                <input type="submit" value="Submit">  
            </p>    
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                };
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if(!this.name)this.errors.push("Name required");
                if(!this.review)this.errors.push("Review required");
                if(!this.rating)this.errors.push("Rating required");
                if(!this.recommend)this.errors.push("Recommend required");
            }
        },
    },
});

Vue.component("product-tabs", {
    template:  `
        <div class="producTabs">
            <div>
                <span class="tab" 
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs" 
                    :key="index" 
                    @click="selectedTab = tab"
                    >{{tab}}
                </span>
            </div>
            <div class="review" v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length"> 
                    There are not reviews yet.
                </p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{review.name}}</p>
                        <p>Rating: {{review.rating}}</p>
                        <p>Comment: {{review.review}}</p>
                        <p>Recommend: {{review.recommend}}</p>
                    </li>
                </ul>
            </div>
            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
    data(){
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: "Reviews",
        }
    },
    props: {
        reviews: {
            type: Array,
            required: false
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
});