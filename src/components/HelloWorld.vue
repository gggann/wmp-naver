<template>
  <div>
    <!-- <div class="hello"> -->
    <div class="top">
      <div id='abutton' style="opacity:0.6">
        <div><span style="color:red">총</span>{{ total }}</div>
        <input v-model="message" @focus="handleFocus" @keydown.enter="idcate" :style="{ width: inputWidth + 'px' }" @input="adjustInputWidth" /><br>
        <!-- <button @click="idcatecatal">카탈로그검색{{ total2 }}</button> -->
        <button @click="idcate">검색</button><br>
        <button @click="page++, idcate()">{{ "下页" + page }}</button><br>
        <button @click="page--, idcate()">{{ "上页" + page }}</button><br>
        <div v-if="force"><span style="color:red">{{ force }}</span>로 검색</div>
        <div v-if="errata"><span style="color:red">{{ errata }}</span>로 검색</div>
        <!-- <input v-model="naverID" @keydown.enter="wendang" placeholder="네이버ID" />
        <button @click="wendang(naverID)">카탈로그검색</button>
        <input v-model="naverBid" @keydown.enter="wendang2(naverBid)" placeholder="BID" />
        <button @click="wendang2(naverBid)">BID검색</button>
        <button @click="clear()" style="color:red">클리어</button> -->

      </div>
      <div style="position: relative;opacity:1">
        <div id="catalinfo" v-for="(v, i) in catalgeshu" :key="i">
          {{ catalgeshu[i] }} :
          <span style="color: red" v-clipboard:copy="catalbid[i]" @click="wendang2(catalbid[i])">{{ catalbid[i]
          }}</span>
        </div>


        <div id="naverhtml" v-html="naverhtml"></div>
      </div>
    </div>
    <div v-html="ehtml"></div>

    <div id='aaa'>
      <div id="상품" class="PROD" v-for="v in info" :key="v.id">
        <div>
          <div id="카테고리">
            <span v-if="v.category1Name">{{ v.category1Name }}</span>
            <span v-if="v.category2Name">{{ " > " + v.category2Name }}</span>
            <span v-if="v.category3Name">{{ " > " + v.category3Name }}</span>
            <span v-if="v.category4Name">{{ " > " + v.category4Name }}</span>
          </div>

          <span id="브랜드" v-if="v.maker" style="color: red">{{ v.maker }}</span>
          <a :href="v.crUrl" target="_blank"><img class="card-img-top" :src="v.imageUrl + '?type=f192'"
              alt="Card image cap" /></a>
          <div id="딜명" @click="wendang3(v.id)">
            {{ v.productTitle }} : {{ v.price }}원
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import cheerio from 'cheerio'
// import $ from 'jquery'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
  },
  data() {
    return {
      info: [],
      total: "",
      total2: "",
      inputWidth: 50,
      message: "",
      cate통계: [],
      cate통계코드: [],
      page: 1,
      naverhtml: "",
      naverID: "",
      htmlinfo: "",
      catalgeshu: "",
      catalbid: "",
      errata: "",
      force: "",
      naverBid: "",
      ehtml:''
    }
  },
  methods: {
    adjustInputWidth(event) {
      const inputText = event.target.value;

      // 创建一个隐藏的 span 元素，用于计算文本宽度
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.whiteSpace = 'pre';
      span.textContent = inputText;

      // 将 span 添加到 DOM，并获取宽度
      document.body.appendChild(span);
      const textWidth = span.getBoundingClientRect().width;
      document.body.removeChild(span);

      // 设置输入框宽度
      this.inputWidth = Math.max(50, textWidth + 10); // 添加 10px 的 padding
    },
    handleFocus(event) {
      event.target.select();
    },
    idcate: async function () {
      this.naverhtml = "";
      this.naverID = "";
      this.errata = "";
      this.force = "";
      this.catalbid = "";
      this.catalgeshu = "";
      this.naverBid = "";
      this.info = []
      that = this
      if (this.message != "") {
        var that = this;
        this.once = false;
        var vvhtml = ''
        await axios
          .get(
            //"naverann/search/all?frm=NVSHPAG&origQuery=xx&pagingIndex=4&pagingSize=40&productSet=total&query=xx&sort=rel&viewType=lst"
            "/naverann/search/all?frm=NVSHPAG&origQuery=" +
            encodeURIComponent(that.message) +
            "&pagingIndex=" +
            that.page +
            "&pagingSize=40&productSet=total&query=" +
            encodeURIComponent(that.message) +
            "&sort=rel&viewType=lst"
          )

          .then((res) => {
            var that = this
            const html = res.data;
            const $ = cheerio.load(html);
            const nextData = $('#__NEXT_DATA__').html();
            // that.ehtml = res.data
            window.aaa = nextData
            const nextDataObject = JSON.parse(nextData);
            window.bbb = nextDataObject
            let rdata = (nextDataObject.props.pageProps.initialState);
            window.ccc = rdata
           // rdata = rdata.replaceAll("<","&lt").replaceAll('>','&gt')
            window.rdata = rdata
            let rrdata = rdata.replaceAll('\\', "")
            rrdata = JSON.parse(rdata)
            this.total = rrdata.compositeProducts.total
            let ccc = rrdata.compositeProducts.list
            let ddd = []
            this.errata = rrdata.queryValidate.errata
            this.force = rrdata.queryValidate.force
            console.log(rrdata.queryValidate.errata)
            for (let i of rrdata.compositeProducts.list) {
              let iftype = i.item.rank
              if (typeof (iftype) == 'number') {
                that.info.push(i.item)
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });

      }
    },
    clear() {
      this.naverhtml = ""
      this.catalgeshu = ""
      this.catalbid = ""
    },
    async wendang2(vv) {
      if (vv != "") {
        this.naverBid = vv;
      }

      var that = this;
      if (this.naverID !== "") {
        await axios
          .get(
            "/catalog/" +
            this.naverID +
            "?purchaseConditionSequence=" +
            this.naverBid
          )

          .then((res) => {
            this.naverhtml = res.data;
          })
          .catch(function (error) {
            // 请求失败处理
            console.log(error);
          });

        $(".filter_condition_group__2SPoo").addClass("filter_expand__1vspt");
      }
    },
    async wendang() {
      // this.info = "";
      this.naverBid = "";
      var that = this;
      await axios
        .get("/catalog/" + this.naverID + "?sort=LOW_PRICE")

        .then((res) => {
          this.naverhtml = res.data;
        })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
        });

      let aaa = JSON.parse($("#__NEXT_DATA__")[0].innerHTML);
      console.log(aaa)
      if (
        aaa.props.pageProps.initialState.catalog.catalogStatistics
          .prchCondValList
      ) {
        that.catalgeshu =
          aaa.props.pageProps.initialState.catalog.catalogStatistics.prchCondValList.split(
            "/"
          );
        that.catalbid =
          aaa.props.pageProps.initialState.catalog.catalogStatistics.prchCondValSeqList.split(
            "/"
          );
      }

      $(".filter_condition_group__2SPoo").addClass("filter_expand__1vspt");
    },
    async wendang3(vv) {
      // this.info = "";
      this.naverID = vv
      this.naverBid = "";
      var that = this;
      await axios
        .get("/catalog/" + vv + "?sort=LOW_PRICE")

        .then((res) => {
          this.naverhtml = res.data;
        })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
        });

      let aaa = JSON.parse($("#__NEXT_DATA__")[0].innerHTML);
      if (
        aaa.props.pageProps.initialState.catalog.catalogStatistics
          .prchCondValList
      ) {
        that.catalgeshu =
          aaa.props.pageProps.initialState.catalog.catalogStatistics.prchCondValList.split(
            "/"
          );
        that.catalbid =
          aaa.props.pageProps.initialState.catalog.catalogStatistics.prchCondValSeqList.split(
            "/"
          );
      }

      $(".filter_condition_group__2SPoo").addClass("filter_expand__1vspt");
    },

    idcatecatal: async function () {
      this.naverhtml = "";
      this.errata = "";
      this.force = "";
      this.naverID = "";
      this.catalbid = "";
      this.catalgeshu = "";
      this.naverBid = "";
      if (this.message != "") {
        var that = this;

        this.once = false;
        await axios
          .get(
            "/api/search/all?sort=rel&pagingIndex=" +
            that.page +
            "&pagingSize=40&viewType=list&productSet=model&deliveryFee=&deliveryTypeValue=&frm=NVSHMDL&query=" +
            encodeURIComponent(that.message) +
            //that.message+
            "&origQuery=%EB%8B%A4%EC%9D%B4%EC%8A%A8&iq=&eq=&xq=&window="
          )

          .then((res) => {
            that.errata = res.data.queryValidateResult.errata
            that.force = res.data.queryValidateResult.force

            that.info = res.data.shoppingResult;
            that.total2 = res.data.shoppingResult.total;

            console.log(res.data.shoppingResult);
          })
          .catch(function (error) {
            // 请求失败处理
            console.log(error);
          });
      }
    },
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  background-color: red;
}



.PROD {
  background-color: rgb(235, 247, 235, 1);
  width: 15%;
  height: 8%;
  float: left;
  position: relative;
  border: 1px solid #747474;
  display: table;
}

#abutton {
  position: fixed;
  top: 2%;
  right: 0;
  background-color: lightblue;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  z-index: 9999;
}


#카테고리 {
  border: 0.5px solid #928d8d;
  height: 30px;
  overflow: auto;
  font-size: 12px;
}



#aaa {
  margin-top: 0px;
}

#catalinfo {
  background-color: rgb(255, 255, 255);
  width: 10%;
  float: left;
  position: relative;
  border: 1px solid #747474;
}


#브랜드 {
  position: absolute;
  right: 0%;
  font-size: 11px;
}

#딜명 {
  border: 0.5px solid #d1c3c3;
  height: 100px;
  overflow: auto;
}

#fenye {
  width: 100%;
  position: absolute;
  bottom: 30;
}
</style>
