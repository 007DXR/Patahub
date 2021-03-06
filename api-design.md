# API 设计稿
## 数据表及其形式
注：下面中所有的 `xx编号` 后期可考虑替换为 IPFS 生成的识别码或者 DOI 码。
### 论文表
name: `papers`

|论文编号id|论文标题title|论文链接link|论文作者（用户）user|
|--|--|--|--|
|1|Retrospective on the 2021 BASALT Competition on Learning from Human Feedback|https://arxiv.org/abs/2204.07123|Rohin Shah|
|2|Exact and approximate determination of the Pareto set using minimal correction subsets|https://arxiv.org/abs/2204.06908|Andreia P. Guerreiro|

### 数据集表
name: `datasets`

|数据集编号id|数据集名称name|数据集地址link|
|--|--|--|
|1|ImageNet|https://image-net.org/download.php|
|2|ECDIT|https://github.com/SYCstudio/ECDICT|
|3|ChinesXinhua|https://github.com/SYCstudio/chinese-xinhua|

### 用户表
name: `users`

**现阶段不考虑**

|用户名称|用户|验证信息（密码）|
|--|--|--|

### 论文与数据集关系表
name: `paperdatarelas`

|论文编号paperid|数据集编号datasetid|
|--|--|
|1|2|
|1|3|

### 结果表
name: `results`

|结果编号id|结果类型datatype|结果数据data|
|--|--|--|
|1|link|https://arxiv.org/pdf/2204.07123.pdf#page=5|
|2|link|https://arxiv.org/pdf/2204.06908.pdf#page=9|
|3|img|https://sycstudio.com/gravatar.png|
|4|csv|https://github.com/SYCstudio/ECDICT/blob/master/ecdict.mini.csv|

结果类型与结果数据相适应，计划支持以下几种类型的结果

* `link`：链接，指向pdf的某一页
* `img`：指向图片地址
* `csv`：指向csv表格数据
* `other`(`bin`)：其它，默认为二进制流形式

### RCD关联表
name: `rcds`

|论文编号paperid|数据编号datasetid|论文内结果代号innerindex|结果编号|代码地址codelink|
|--|--|--|--|--|
|1|1|Table1|1|https://github.com/SYCstudio/QWordWindow/blob/master/crandomqueue.h|
|2|2|Figure1|2|https://github.com/SYCstudio/OI/blob/master/Practice/2020.7.20/Luogu6619.cpp|

## API交互接口

### 获取论文列表
接口功能：获取论文列表
支持格式：`json`  
HTTP 请求方式：`GET`  
调用函数：get_paper_list
请求地址：`/paper`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|paper_id|false|int|论文id|
|title|false|str|论文标题|
|user|false|str|--|

返回参数：

|返回字段|类型|说明|
|--|--|--|
|papers|list|返回论文元数据列表[{user,link,id,title}]|

### 获取关于指定数据集的论文列表
支持格式：`json`  
HTTP 请求方式：`GET`  
调用函数：get_paper_of_dataset
请求地址：`/paperofdataset`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|dataset_id|true|int|数据集id|

返回参数：

|返回字段|类型|说明|
|--|--|--|
|papers|list|返回论文元数据列表[{paperid:,datasetid}]

### 新增论文
接口功能：
支持格式：`json`  
HTTP 请求方式：`POST`  
请求地址：`/paper`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|user|true|str|用户名|
|title|true|str|论文名|
|link|true|str|论文链接|

返回参数：

|返回字段|类型|说明|
|--|--|--|
|user|str|--|
|title|str|--|
|link|str|--|
|id|int|系统生成的论文id|

### 删除论文
接口功能：
支持格式：`json`  
HTTP 请求方式：`DELETE`  
请求地址：`/{user}/paper`
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|paper_id|true|int|论文id|

返回参数：

|返回字段|类型|说明|
|--|--|--|

### 获取论文详情
接口功能：获取论文详情
支持格式：`json`  
HTTP 请求方式：`POST`  
请求地址：`/paper/{paper_id}`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|paper_id|true|int|论文id|


返回参数：

|返回字段|类型|说明|
|--|--|--|
|paper|dict|包含paper_id,title,link,user|


### 获取关于指定数据集的数据集列表
支持格式：`json`  
HTTP 请求方式：`GET`  
调用函数：get_dataset_of_paper
请求地址：`/datasetofpaper`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|paper_id|true|int|数据集id|

返回参数：

|返回字段|类型|说明|
|--|--|--|
|datasets|list|返回数据集元数据列表[{paperid:,datasetid}]

### 获取数据集列表
接口功能：获取数据集列表
支持格式：`json`  
HTTP 请求方式：`GET`  
请求地址：`/dataset`  
请求函数：get_dataset_list
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|dataset_id|false|int|数据集id|
|name|false|str|数据集名称|
|user|false|str|用户名称|

返回参数：

|返回字段|类型|说明|
|--|--|--|
|datasets|list|返回数据集元数据列表[{user,link,id,title}|

### 创建数据集
接口功能：创建数据集
支持格式：`json`  
HTTP 请求方式：`POST`  
请求地址：`/dataset`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|dataset_name|true|str|数据集名称|
|dataset_link|true|str|数据集链接|
|user|true|str|用户名称|

返回参数：

|返回字段|类型|说明|
|--|--|--|
|user|str|--|
|title|str|--|
|link|str|--|
|id|int|系统生成的数据集id|


### 删除数据集
接口功能：删除数据集
支持格式：`json`  
HTTP 请求方式：`DELETE`  
请求地址：`/dataset`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|dataset_id|true|int|数据集id|

返回参数：

|返回字段|类型|说明|
|--|--|--|
||0/1|表示是否删除成功|


### 获取RCD关系
接口功能：
支持格式：`json`  
HTTP 请求方式：`GET`  
请求地址：`/rcd`  
请求函数：get_rcd
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|paper_id|true|int|论文id|


返回参数：

|返回字段|类型|说明|
|--|--|--|
|rcds|list|[{paper_id,dataset_id,result_id,code_link,data_link}]|

### 创建rcd关系
接口功能：
支持格式：`json`  
HTTP 请求方式：`POST`  
请求地址：`/rcd`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
建议添加rcd_id

|result_id|true|int|结果id|
|dataset_id|true|int|数据集id|
|code_id||int|代码id|
<!-- |result_link|true|str|结果链接| -->
|code_link|true|str|代码链接|
|data_link|true|str|数据链接|

返回参数：

|返回字段|类型|说明|
|--|--|--|
|--|bool|表示是否创建成功|

### 获得结果列表
接口功能：
支持格式：`json`  
HTTP 请求方式：`GET`  
请求地址：`/paper/{paper_id}/results`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|paper_id|true|int|论文id|


返回参数：

|返回字段|类型|说明|
|--|--|--|
|result_list|list|--|


### 查看论文中结果详情
接口功能：
支持格式：`json`  
HTTP 请求方式：`POST`  
请求地址：`/paper/{paper_id}/results/{result_id}`  
请求参数：

|参数|必选|类型|说明|
|--|--|--|--|
|paper_id|true|int|论文id|
|result_id|true|int|结果id|

返回参数：

|返回字段|类型|说明|
|--|--|--|
|paperid|int|--|
|innerindex|str|--|
|datatype|link/img/csv|--|
|data|--|--|


