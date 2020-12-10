import React, { useState,useEffect } from 'react';
import { Tree,Input,Button,message,Modal} from 'antd';
import TreeData from "./TreeData";

interface Node{
    title:'';
    key:'';
}

//hook其实重点就是解决逻辑复用，比如反复用的API，或者业务逻辑，
//在组件之间复用状态逻辑很难,所以用hook来自定义一个hook逻辑来复用，
export default function Test2 (){

    const[nodeTreeData,setTreeData]=useState(JSON.parse(JSON.stringify(TreeData)));
    const[currentClickNode,setCurrentClickNode]=useState({title:'',key:''});
    const[isModalVisible,setIsModalVisible]=useState(false);
    const[notice,setNotice]=useState('');
    const[inputText,setInputText]=useState('');
    let nodeList:Array<any>=[];
    useEffect(()=>{
        initNodeList(nodeTreeData);
    },[nodeList]);

    function initNodeList(treeData:Array<any>){
        treeData.map((item,index)=>{
            nodeList.push(item);
            if(item.children){
                initNodeList(item.children);
            }
        })
    }
    function searchAndEditData(data:any){
        for(let i=0;i<data.length;i++){
            if(data[i].key === currentClickNode?.key){
                data[i].title=inputText;
                //找到了替换treeData，同时替换搜索用的nodeList；
                let findIndex = nodeList.findIndex((item)=> item.key === currentClickNode?.key);
                if(findIndex !== -1){
                    nodeList[findIndex].title = inputText;
                }
                break;
            }else{
                if(data[i].children){
                    searchAndEditData(data[i].children);
                }
            }
        }
    }
    function onComplete(){
        let temp= nodeTreeData.slice();
        if(nodeList.findIndex((item)=> item.title === inputText && item.key!== currentClickNode.key) !== -1){
            setNotice('标签名称重复');
            setIsModalVisible(true);
            message.error('标签名称重复', 2);
            //重复
            return;
        }
        searchAndEditData(temp);
        // initNodeList(temp);
        setTreeData(temp);
        setCurrentClickNode({title:'',key:''});
        setInputText('');
    }
    function onCancel(){
        setCurrentClickNode({title:'',key:''});
    }
    function onClick(nodeData:Node){
        setInputText( nodeData.title);
        setCurrentClickNode({title:nodeData.title,key:nodeData.key});
    }
    function renderNodeEditBtn(nodeData:Node){
        return(
            <div>
                {nodeData.title}
                <Button style={{marginLeft:10}} onClick={()=>onClick(nodeData)} size={'small'}>修改</Button>
            </div>
        )
    }
    function renderNodeEditInput(nodeData:Node){
        return(
            <div style={{display:'flex',flexDirection:'row'}}>
                <Input defaultValue={nodeData.title} onChange={(event)=> {
                    setInputText(event.target.value);
                }}/>
                <Button style={{marginLeft:10,alignSelf:'center'}} onClick={()=>onComplete()} size={'small'}>完成</Button>
                <Button style={{marginLeft:10,alignSelf:'center'}} onClick={()=>onCancel()} size={'small'}>取消</Button>
            </div>
        )
    }
    function handleOk(){
        setNotice('');
        setIsModalVisible(false);
    }
    function handleCancel(){
        setNotice('');
        setIsModalVisible(false);
    }
    return (
        <div>
            <Tree
                checkable
                treeData={nodeTreeData}
                titleRender={(nodeData:any)=>{
                    if(nodeData.key === currentClickNode?.key){
                        return renderNodeEditInput(nodeData);
                    }
                    return renderNodeEditBtn(nodeData)
                }}
            />
            <Modal
                title="Basic Modal"
                visible={isModalVisible}
                onOk={()=>handleOk()}
                onCancel={()=>handleCancel()}
            >
                <p>{notice}</p>
            </Modal>
        </div>
    )
}