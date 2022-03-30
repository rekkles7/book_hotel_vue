<template>
  <div>
    <div class="head-container">
      <!--增删改查按钮-->
      <div class="crud-opts">
      <span class="crud-opts-left">
           <!--左侧插槽-->
           <slot name="left"/>
           <el-button
               class="filter-item"
               size="mini"
               type="success"
               icon="el-icon-edit"
               :disabled="selectData.length !== 1"
               @click="updateOperation"
           >
             修改
           </el-button>
                   <el-button
                       class="filter-item"
                       size="mini"
                       type="primary"
                       icon="el-icon-plus"
                       @click="confirmOperation"
                   >
             确认
           </el-button>
           <el-button
               slot="reference"
               class="filter-item"
               type="danger"
               icon="el-icon-delete"
               size="mini"
               @click="cancelOperation"
           >
             取消
           </el-button>
           <el-button
               class="filter-item"
               size="mini"
               type="warning"
               icon="el-icon-download"
           >导出</el-button>
        <!--右侧-->
           <slot name="right"/>
        </span>
        <el-button-group class="crud-opts-right">
          <el-button
              size="mini"
              plain
              type="info"
              icon="el-icon-search"
          />
          <el-button
              size="mini"
              icon="el-icon-refresh"
          />
          <el-popover
              placement="bottom-end"
              width="150"
              trigger="click"
          >
            <el-button
                slot="reference"
                size="mini"
                icon="el-icon-s-grid"
            >
              <i
                  class="fa fa-caret-down"
                  aria-hidden="true"
              />
            </el-button>
            <el-checkbox
            >
              全选
            </el-checkbox>
          </el-popover>
        </el-button-group>
      </div>
    </div>
    <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          fixed
          v-if="show"
          prop="orderId"
          label="订单编号"
          width="150">
      </el-table-column>
      <el-table-column
          fixed
          prop="orderUserName"
          label="预留姓名"
          width="150">
      </el-table-column>
      <el-table-column
          prop="orderUserTelephone"
          label="预留电话"
          width="120">
      </el-table-column>
      <el-table-column
          prop="startOfDate"
          label="入住日期"
          width="300">
      </el-table-column>
      <el-table-column
          prop="endOfDate"
          label="离店日期"
          width="300">
      </el-table-column>
      <el-table-column
          prop="orderPrice"
          label="订单价格"
          width="120">
      </el-table-column>
      <el-table-column
          prop="orderUserPs"
          label="备注信息"
          width="120">
      </el-table-column>
      <el-table-column
          prop="roomName"
          label="房型名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="orderRoomNumber"
          label="房型数量"
          width="120">
      </el-table-column>
      <el-table-column
          prop="orderCreateTime"
          label="创建时间"
          width="120">
      </el-table-column>
      <el-table-column
          prop="orderPayTime"
          label="支付时间"
          width="120">
      </el-table-column>
      <el-table-column
          prop="orderStatus"
          label="订单状态"
          width="120">
      </el-table-column>
    </el-table>
    <el-dialog append-to-body title="订单信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" size="small" label-width="80px">
        <el-form-item label="订单id" v-if="show">
          <el-input v-model="form.orderId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预留姓名">
          <el-input v-model="form.orderUserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预留电话">
          <el-input v-model="form.orderUserTelephone" autocomplete="off" style="width: 500px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrder(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Element from "element-ui";

export default {
  name: "Order",
  created() {
    this.getOrderInfo()
  },
  methods: {
    mapForm(selectRow) {
      this.form = selectRow
    },
    getOrderInfo(){
      let adminId = this.$store.getters.getUserId;
      this.$request.get('admin/order/selectAllOrderByAdminId',{
        params: {
          adminId: adminId
        }
      }).then(res =>{
        this.tableData = res.data.data
      })
    },
    updateOperation(){
      this.mapForm(this.selectData[0])
      this.dialogFormVisible = true
    },
    updateOrder(data){
        this.$request({url: 'admin/order/updateOrder',method: "post", data: data}).then(res => {
          Element.Message.success("操作成功")
          this.dialogFormVisible = false
          this.getOrderInfo()
        })
    },
    cancelOperation(){
      this.cancelOrder(this.selectData.map(value => value.orderId))
    },
    confirmOperation(){
      this.confirmOrder(this.selectData.map(value => value.orderId))
    },
    cancelOrder(data){
      this.$request({url: 'admin/order/cancelOrder',method:"delete",data: data}).then(res => {
        Element.Message.success("操作成功")
        this.getOrderInfo()
      })
    },
    confirmOrder(data){
      this.$request({url: 'admin/order/confirmOrder', method:"delete",data: data}).then(res => {
        Element.Message.success("操作成功")
        this.getOrderInfo()
      })
    },
    // updateOrder(data) {
    //   let op = this.$store.state.operation
    //   console.log("提交给后端/admin/room接口的数据", data)
    //   console.log(op)
    //   this.$request({url: 'admin/room', method: op, data: data}).then(res => {
    //     console.log(op + '房型成功')
    //     Element.Message.success("操作成功")
    //     this.dialogFormVisible = false
    //     this.getRoomInfo()
    //   })
    // },
    handleSelectionChange(rows) {
      this.selectData = rows
    },
  },
  data() {
    return {
      show: false,
      tableData: [],
      dialogFormVisible: false,
      form: {
        orderId: '',
        orderUserName: '',
        orderUserTelephone: '',
        openId: '',
        startOfDate: '',
        endOfDate: '',
        orderStatus: '',
        orderPrice: '',
        hotelId: '',
        roomId: '',
        orderUserPs: '',
        orderRoomNumber: '',
      },
      name: "",
      selectData: [],
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
