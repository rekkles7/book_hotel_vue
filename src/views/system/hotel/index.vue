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
               type="primary"
               icon="el-icon-plus"
               @click="updateOperation('post')"
           >
             新增
           </el-button>
           <el-button
               class="filter-item"
               size="mini"
               type="success"
               icon="el-icon-edit"
               :disabled="selectData.length !== 1"
               @click="updateOperation('put')"
           >
             修改
           </el-button>
           <el-button
               slot="reference"
               class="filter-item"
               type="danger"
               icon="el-icon-delete"
               size="mini"
               @click="updateOperation('delete')"
           >
             删除
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
          prop="hotelName"
          label="酒店名称"
          width="150">
      </el-table-column>
      <el-table-column
          prop="hotelDescription"
          label="酒店介绍"
          width="120">
      </el-table-column>
      <el-table-column
          label="酒店图片"
          width="120">
        <template slot-scope="scope">
          <el-image :src="scope.row.hotelImgUrl" style="width:200px;height:100px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column
          prop="hotelAddress"
          label="酒店地址"
          width="120">
      </el-table-column>
      <el-table-column
          prop="hotelService"
          label="酒店服务"
          width="300">
      </el-table-column>
      <el-table-column
          prop="hotelScore"
          label="酒店评分"
          width="120">
      </el-table-column>
    </el-table>
    <el-dialog append-to-body title="酒店信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" size="small" label-width="80px">
        <el-form-item label="酒店名称">
          <el-input v-model="form.hotelName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店介绍">
          <el-input v-model="form.hotelDescription" autocomplete="off" style="width: 500px"></el-input>
        </el-form-item>
        <el-form>
          <el-form-item label="酒店图片">
            <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :http-request="upload"
                multiple=""
                :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
              >
              <el-button
                  style="margin-left: 10px"
                  size="small"
                  type="success"
                  @click="submitUpload"
              >上传到服务器</el-button
              >
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
          <img :src="form.hotelImgUrl" style="width: 200px;height: 100px;"/>
        </el-form>
        <el-form-item label="酒店地址">
          <el-input v-model="form.hotelAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店服务">
          <el-input v-model="form.hotelService" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateHotel(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Element from "element-ui";

export default {
  name: "Hotel",
  created() {
    this.getHotelInfo()
  },
  methods: {
    mapForm(selectRow) {
      this.form = selectRow
    },
    getHotelInfo(){
      this.$request.get('/user/hotel/selectAllHotel').then(res =>{
        this.tableData = res.data.data
      })
    },
    updateOperation(op){
      if (op === 'put'){
        this.mapForm(this.selectData[0])
        // this.url = this.selectData[0].hotelImgUrl
      }
      this.$store.commit('SET_OP', op)
      console.log(this.form)
      this.dialogFormVisible = op !== 'delete'
      if (op !== 'delete') this.getRole()
      else this.updateHotel(this.selectData.map(value => value.hotelId))
    },
    updateHotel(data) {
      let op = this.$store.state.operation
      console.log("提交给后端/admin/hotel接口的数据", data)
      console.log(op)
      this.$request({url: 'admin/hotel', method: op, data: data}).then(res => {
        console.log(op + '酒店成功')
        Element.Message.success("操作成功")
        this.dialogFormVisible = false
        this.getHotelInfo()
      })
    },
    handleSelectionChange(rows) {
      this.selectData = rows
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    //通过onchanne触发方法获得文件列表
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    upload(file) {
      let fd = new FormData();

      //文件信息中raw才是真的文件
      fd.append("files", file.file);
      console.log(fd);

      this.$request.post(`/admin/hotel/upload`, fd).then((res) => {
        this.form.hotelImgUrl = res.data;
      });
    },
  },
  data() {
    return {
      tableData: [],
      imgUrl: '',
      dialogFormVisible: false,
      form: {
        hotelId: '',
        hotelName: '',
        hotelDescription: '',
        hotelAddress: '',
        hotelImgUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.3png.com%2F11b9c799ce7f3e4f6ab5d70dd9b84ee0c642.png&refer=http%3A%2F%2Fimg1.3png.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650953347&t=28ab42e67500411aba6caa2c227a453d",
        hotelService: '',
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
