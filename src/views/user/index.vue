<!-- 列表页面 -->
<template>
    <div class="app-container">
      <div class="filter-container">
        <el-input
          v-model="listQuery.username"
          placeholder="请输入用户名"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <!-- <el-select
          v-model="listQuery.payMethod"
          placeholder="是否过期"
          clearable
          style="width: 200px"
          class="filter-item"
        >
          <el-option
            v-for="item in importanceOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select> -->
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <!-- <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >
          新增订阅
        </el-button> -->
      </div>
  
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          label="ID"
          prop="id"
          sortable="custom"
          align="center"
          width="180"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="用户昵称"
          prop="nickname"
          width="200px"
          align="center"
        />
        <el-table-column 
            label="用户名" 
            prop="username"
          width="200px"
          align="center">
        </el-table-column>
        <el-table-column
          label="密码"
          prop="password"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="邮箱"
          prop="mail"
          align="left"
        >
        </el-table-column>
        <el-table-column
          label="性别"
          prop="gender"
          width="150px"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.gender==1?'女':'男' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="已购买套餐"
          prop="taocan"
          align="left"
        >
        <template slot-scope="{ row }">
            <el-button type="primary" @click="lookUp(row.id)">查看</el-button>
        </template>
        </el-table-column>
        <el-table-column
          label="最近申请时间"
          prop="taocan"
          align="left"
        >
        </el-table-column>
        <el-table-column
          label="是否过期"
          prop="taocan"
          align="left"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" fixed="right">
          <template slot-scope="{ row, $index }">
            <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button> -->
            <el-button
              size="mini"
              type="warning"
              @click="openRem(row.id, $index)"
            >
              绑定套餐
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
  
      <el-dialog title="选择套餐" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="400px"> 
        <div class="dialog-center">
            <el-select
          v-model="buyValue"
          placeholder="是否过期"
          clearable
          style="width: 200px"
          class="filter-item"
        >
          <el-option
            v-for="item in importanceOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> 取消 </el-button>
          <el-button
            type="primary"
            @click="submitValue"
            :loading="loading"
          >
            提交
          </el-button>
        </div>
      </el-dialog>
  
      <el-dialog :visible.sync="dialogPvVisible" title="已购买套餐" width="30%">
        <el-table
          :data="orderList"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="key" label="Channel" />
          <el-table-column prop="pv" label="Pv" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false"
            >关闭</el-button
          >
        </span>
      </el-dialog>
    </div>
  </template>
    
    <script>
  import waves from "@/directive/waves"; // waves directive
  import { parseTime } from "@/utils";
  import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
  import { getAirport, createAirport, editAirport,getAllSupplier,updateTraffic,getAllBundles } from "@/api/airports";
  import {getUserList} from "@/api/user"
  const calendarTypeOptions = [
    { key: "CN", display_name: "China" },
    { key: "US", display_name: "USA" },
    { key: "JP", display_name: "Japan" },
    { key: "EU", display_name: "Eurozone" },
  ];
  
  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name;
    return acc;
  }, {});
  
  export default {
    name: "ComplexTable",
    components: { Pagination },
    directives: { waves },
    filters: {
      clientFilter(val) {
        const clientMap = {
          0: "Clash",
          1: "V2rayN",
          2: "Clash/V2rayN",
        };
        return clientMap[val];
      },
      statusFilter(status) {
        const statusMap = {
          0: "primary",
          1: "success",
          2: "danger",
        };
        return statusMap[status];
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type];
      },
    },
    data() {
      return {
        tableKey: 0,
        list: [{}],
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          username: "",
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [
          { label: "ID Ascending", key: "+id" },
          { label: "ID Descending", key: "-id" },
        ],
        statusOptions: ["published", "draft", "deleted"],
        payMethodOptions: [
          {
            label: "线上支付",
            value: 1,
          },
          {
            label: "个人支付",
            value: 0,
          },
        ],
        clientOptions: [
          {
            label: "Clash",
            value: 0,
          },
          {
            label: "V2rayN",
            value: 1,
          },
          {
            label: "都支持",
            value: 2,
          },
        ],
        showReviewer: false,
        temp: {
          id: undefined,
          traffic: '',
          url: "",
          providerId: "",
          validTime: "",
          buyTime: "",
          buyPrice:1.00
        },
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          update: "编辑",
          create: "新增",
        },
        dialogPvVisible: false,
        orderList: [],
        rules: {
          type: [
            { required: true, message: "type is required", trigger: "change" },
          ],
          timestamp: [
            {
              type: "date",
              required: true,
              message: "timestamp is required",
              trigger: "change",
            },
          ],
          title: [
            { required: true, message: "title is required", trigger: "blur" },
          ],
        },
        downloadLoading: false,
        supplierList:[],
        loading:false,
        buyValue:""
      };
    },
    created() {
    //   this.getList();
    this.getListA()
    //   this.getAllSup()
    },
    methods: {
      //获取机场列表
      getList() {
        this.listLoading = true;
        getUserList(this.listQuery)
          .then((response) => {
            // fetchList(this.listQuery).then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          })
          .catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          });
      },
      getListA(){
        this.listLoading = true;
        getAllBundles().then(res=>{
            this.importanceOptions = res.data
            this.listLoading = false;
        })
      },
      lookUp(val){

      },
      submitValue(){
        this.loading = true
        //绑定套餐接口
        this.loading = false
        this.dialogFormVisible = false
      },
      getAllSup(){
          getAllSupplier().then(res=>{
              this.supplierList = res.data
          })
      },
      handleFilter() {
        this.listQuery.pageNo = 1;
        this.getList();
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: "操作Success",
          type: "success",
        });
        row.status = status;
      },
      sortChange(data) {
        const { prop, order } = data;
        if (prop === "id") {
          this.sortByID(order);
        }
      },
      sortByID(order) {
        if (order === "ascending") {
          this.listQuery.sort = "+id";
        } else {
          this.listQuery.sort = "-id";
        }
        // this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          traffic: '',
          url: "",
          providerId: "",
          validTime: "",
          buyTime: "",
          buyPrice:1.00
        };
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      createData() {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
              this.loading = true
            createAirport(this.temp).then(() => {
              this.loading = false
              this.list.unshift(this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Created Successfully",
                type: "success",
                duration: 2000,
              });
            }).finally(()=>{
              this.loading = false
            })
          }
        });
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row); // copy obj
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      updateData() {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
              this.loading = true
            const tempData = Object.assign({}, this.temp);
            editAirport(tempData).then(() => {
              this.loading = false
              const index = this.list.findIndex((v) => v.id === this.temp.id);
              this.list.splice(index, 1, this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Update Successfully",
                type: "success",
                duration: 2000,
              });
            }).finally(()=>{
              this.loading = false
            })
          }
        });
      },
      handleDelete(row, index) {
        this.$notify({
          title: "Success",
          message: "Delete Successfully",
          type: "success",
          duration: 2000,
        });
        this.list.splice(index, 1);
      },
      handleDownload() {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = ["timestamp", "title", "type", "importance", "status"];
          const filterVal = [
            "timestamp",
            "title",
            "type",
            "importance",
            "status",
          ];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "table-list",
          });
          this.downloadLoading = false;
        });
      },
      formatJson(filterVal) {
        return this.list.map((v) =>
          filterVal.map((j) => {
            if (j === "timestamp") {
              return parseTime(v[j]);
            } else {
              return v[j];
            }
          })
        );
      },
      getSortClass: function (key) {
        const sort = this.listQuery.sort;
        return sort === `+${key}` ? "ascending" : "descending";
      },
      openRem(id){
        this.buyValue=""
         this.dialogFormVisible = true
      },
    },
  };
  </script>
    <style scoped>
  .el-rate__item {
    font-size: 16px !important;
  }
  .dialog-center{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>