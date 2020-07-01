<template>
    <div class="bg-white shadow h-100 w-100">
        <h1 v-text="title"></h1>
        <ul>
            <li v-bind:key="todo.title" v-for="todo in items">
                {{todo.title}}
                <div v-if="todo.checked">
                    {{todo.checked}}
                </div>
                <b-button @click="todo.checked = !todo.checked">toggle</b-button>
            </li>

        </ul>

        <input type="text" v-model="item">
        <button @click="items.push({'title': item, 'checked': true})">add item</button>


        <input type="text" v-model="price">
        <div>Tax {{moneyFormatted(tax)}}</div>
        <div>Total {{moneyFormatted(total)}}</div>

    </div>
</template>
<script>
    export default {
        name:"testnew"
        data:()=>(
            {
                title:"my title test new",
                item:'',
                items:[
                    {title:"item 1", checked:true},
                    {title:"item 2", checked:true},
                    {title:"item 3", checked:false},
                    {title:"item 4", checked:true},
                ],
                price:100
            }
        ),
        methods: {
            moneyFormatted : function(price)
            {
                return '$'+price+'.00';
            }
        },
        computed:{
            tax: function () {
                return this.price * 0.1
            },
            total : function () {
                return parseInt(this.price) + this.tax;
            }
        }


    }
</script>