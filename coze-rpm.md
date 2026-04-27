# Coze 兑换码接口文档

## use Code -- 使用兑换码，消费兑换
### 请求示例
curl -X POST 'https://api.coze.cn/v1/workflow/run' \
-H "Authorization: Bearer cztei_hXniHeicaWIrG68kc1WiBgux3UgeUrhpFrgwhc4CkcDebJV8TNvVESzp8y0vvUvik" \
-H "Content-Type: application/json" \
-d '{
  "workflow_id": "7578420683400413211",
  "parameters": {
    "input": "BUBBLE-MIPNS6RA-YSJ3MFNPK6L"
  }
}'

### 响应示例
{"msg":"","data":"{\"output\":\"兑换成功\",\"success\":true}","debug_url":"https://www.coze.cn/work_flow?execute_id=7627031892274151466&space_id=7372469880576376832&workflow_id=7578420683400413211&execute_mode=2","usage":{"input_count":0,"token_count":0,"output_count":0},"execute_id":"7627031892274151466","detail":{"logid":"202604101539054EBF7C11EF79F8E5695B"},"code":0}

> 只要解析出data里的success字段，即可判断是否兑换成功。如果success为true，则兑换成功。  
> 如果success为false，则兑换失败。