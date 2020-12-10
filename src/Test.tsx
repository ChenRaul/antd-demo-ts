import React, { useState } from 'react';
import { Tree,Input,Button,message,Modal} from 'antd';
import TreeData from "./TreeData";

interface Node{
    title:'';
    key:'';
}
interface DemoState{
    currentClickNode:Node;
    treeData:Array<any>;
    isModalVisible:boolean;
    notice:string,
}


export default class Test extends React.Component<{},DemoState>{

    public inputText:string='';
    public nodeList:Array<any>=[];//用于判断重复
    constructor(props:any){
        super(props);
        this.state={
            treeData:JSON.parse(JSON.stringify(TreeData)),//使用此方法解决数组对象的深拷贝，slice（）等方法只能针对不是数组对象或者数组里面没有包含数组或对象的时候有用
            currentClickNode:{title:'',key:''},
            isModalVisible:false,
            notice:'',
        };
        this.initNodeList(this.state.treeData);
        let temp = [1,2,3];
        let temp1 = temp.slice();
        temp1[0] = 4;
        console.log(temp,temp1);
        let temp3= JSON.parse(JSON.stringify(this.state.treeData));
        temp3[0].title='hahah';
        console.log(temp3);
        console.log(this.state.treeData);
    }
    initNodeList(treeData:Array<any>){
        treeData.map((item,index)=>{
            this.nodeList.push(item);
            if(item.children){
                this.initNodeList(item.children);
            }
        })
    }

    onClick(nodeData:any){
        this.inputText = nodeData.title;
        this.setState({
            currentClickNode:{title:nodeData.title,key:nodeData.key}
        })
    }
    //搜索 修改，可能还需要判断重复，排序等问题
    searchAndEditData(data:any){
        for(let i=0;i<data.length;i++){
            if(data[i].key === this.state.currentClickNode?.key){
                data[i].title=this.inputText;
                //找到了替换treeData，同时替换搜索用的nodeList；
                let findIndex = this.nodeList.findIndex((item)=> item.key === this.state.currentClickNode?.key);
                if(findIndex !== -1){
                    this.nodeList[findIndex].title = this.inputText;
                }
                break;
            }else{
                if(data[i].children){
                    this.searchAndEditData(data[i].children);
                }
            }
        }
    }
    //完成
    onComplete(){
        let temp= this.state.treeData.slice();
        if(this.nodeList.findIndex((item)=> item.title === this.inputText && item.key!== this.state.currentClickNode.key) !== -1){
            this.setState({isModalVisible:true,notice:'标签名称重复'});
            message.error('标签名称重复', 2);
            //重复
            return;
        }
        this.searchAndEditData(temp);
        // initNodeList(temp);
        this.setState({treeData:temp,currentClickNode:{title:'',key:''}});
        this.inputText='';
    }
    //取消修改
    onCancel(){
        this.setState({currentClickNode:{title:'',key:''}})
    }
    renderNodeEditBtn(nodeData:Node){
        return(
            <div>
                {nodeData.title}
                <Button style={{marginLeft:10}} onClick={()=>this.onClick(nodeData)} size={'small'}>修改</Button>
            </div>
        )
    }
    renderNodeEditInput(nodeData:Node){
        return(
            <div style={{display:'flex',flexDirection:'row'}}>
                <Input defaultValue={nodeData.title} onChange={(event)=> this.inputText=event.target.value}/>
                <Button style={{marginLeft:10,alignSelf:'center'}} onClick={()=>this.onComplete()} size={'small'}>完成</Button>
                <Button style={{marginLeft:10,alignSelf:'center'}} onClick={()=>this.onCancel()} size={'small'}>取消</Button>
            </div>
        )
    }
    handleOk(){
        this.setState({isModalVisible:false,notice:''});
    }
    handleCancel(){
        this.setState({isModalVisible:false,notice:''});
    }
    render(){
        return (
            <div>
                <Tree
                    checkable
                    treeData={this.state.treeData}
                    titleRender={(nodeData:any)=>{
                        if(nodeData.key === this.state.currentClickNode?.key){
                            return this.renderNodeEditInput(nodeData)
                        }
                        return this.renderNodeEditBtn(nodeData)
                    }}
                />
                <Modal
                    title="Basic Modal"
                    visible={this.state.isModalVisible}
                    onOk={()=>this.handleOk()}
                    onCancel={()=>this.handleCancel()}
                >
                    <p>{this.state.notice}</p>
                </Modal>
            </div>
        )
    }
}