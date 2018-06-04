LinkEditorDemo = function () {
    this.box = new twaver.ElementBox();
    this.network = this.createDraggableNetwork(this.box);
    this.imageNodesDiv = document.createElement('div');
    this.linksDiv = document.createElement('div');
    this.accordion = new twaver.controls.Accordion();
};
twaver.Util.ext('LinkEditorDemo', Object, {
    init: function () {
        this.registImages();
        var mainSplit = new twaver.controls.SplitPane(this.accordion, this.network, 'horizontal', 0.2);
        this.appendChild(mainSplit.getView(), document.getElementById('main'), 0, 0, 0, 0);
        this.initAccordion();
        window.onresize = function (e) {
            /*无效组件，在等待指定毫秒数后，
            刷新组件（调用validate方法）,
            当组件属性更改后，须调用此方法，让组件重画*/ 
            mainSplit.invalidate(); 
        };
    },
    registImages: function () {
        this.registerImage("./images/os/linux.png");
        this.registerImage("./images/os/centos.png");
        this.registerImage("./images/os/debian.png");
        this.registerImage("./images/os/solaris.png");
        this.registerImage("./images/link/HAProxy.png");
        this.registerImage("./images/link/INTARWEB.png");
        this.registerImage("./images/link/SOWEB.png");
        this.registerImage("./images/link/VLAN.png");
        this.registerImage("./images/link/shapeEdit.png");
    },
    registerImage: function (url) {
        this.registerImage(url, this.network);
    },
    addDraggableNodeButton:function(src){
        var image = new Image();
        var imageName = this.getImageName(src);
        image.setAttribute('title', imageName);
        image.setAttribute('draggable', 'true');
        image.style.cursor = 'move';
        image.style.verticalAlign = 'top';
        image.style.width = '40px';
        image.style.height = '40px';
        image.style.padding = '4px 4px 4px 4px';
        image.setAttribute('src', src);
        image.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text','className:twaver.Node');
            e.dataTransfer.setData('Image', 'image:' + imageName);
        }, false);
        
        this.imageNodesDiv.appendChild(image);
        return image;
    },
    addDraggableCreateButton:function(src){
        var image = new Image();
        var imageName = this.getImageName(src);
        image.setAttribute('title', imageName);
        image.setAttribute('draggable', 'true');
        image.style.cursor = 'move';
        image.style.verticalAlign = 'top';
        image.style.width = '40px';
        image.style.height = '40px';
        image.style.padding = '4px 4px 4px 4px';
        image.setAttribute('src', src);
        var that = this;
        image.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            that._createShapeNodeInteractions();
        }, false);
        return image;
    },
    addLinkButton: function (src) {
        var imageName = this.getImageName(src);
        var button = document.createElement('input');
        button.setAttribute('type', 'image');
        button.setAttribute('title', imageName);
        button.style.padding = '5px 5px 5px 5px';
        button.style.width = '40px';
        button.style.height = '40px';
        button.setAttribute('src', src);
        var self = this;
        button.addEventListener('click', function () {
            self.network.setCreateLinkInteractions(function (fromNode, toNode) {
                var link = new twaver.Link();
                link.setStyle('link.type', imageName);
                link.setFromNode(fromNode);
                link.setToNode(toNode);
                return link;
            });
        }, false);
        this.linksDiv.appendChild(button);
        return button;
    },
    initAccordion: function () {
        this.accordion.add('Image Nodes', this.imageNodesDiv);
        this.accordion.add('Links', this.linksDiv);

        this.addDraggableNodeButton('./images/os/linux.png');
        this.addDraggableNodeButton('./images/os/centos.png');
        this.addDraggableNodeButton('./images/os/debian.png');
        this.addDraggableNodeButton('./images/os/solaris.png');
        this.addDraggableNodeButton('./images/link/HAProxy.png');
        this.addDraggableNodeButton('./images/link/INTARWEB.png');
        this.addDraggableNodeButton('./images/link/SOWEB.png');
        this.addDraggableNodeButton('./images/link/VLAN.png');

        this.addLinkButton('./images/link/flexional.png');
        this.addLinkButton('./images/link/orthogonal.png');
        this.addLinkButton('./images/link/extend.top.png');
        this.addLinkButton('./images/link/extend.left.png');
        this.addLinkButton('./images/link/extend.bottom.png');
        this.addLinkButton('./images/link/extend.right.png');
    },
    appendChild: function (e, parent, top, right, bottom, left) {
        e.style.position = 'absolute';
        if (left != null) e.style.left = left + 'px';
        if (top != null) e.style.top = top + 'px';
        if (right != null) e.style.right = right + 'px';
        if (bottom != null) e.style.bottom = bottom + 'px';
        parent.appendChild(e);
    },
    getImageName: function (url) {
        var index = url.lastIndexOf('/');
        var name = url;
        if (index >= 0) {
            name = url.substring(index + 1);
        }
        index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    },
    createDraggableNetwork: function (box) {
        var network = new Network(box);

        network.getView().addEventListener('dragover', function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            e.dataTransfer.dropEffect = 'copy';
            return false;
        }, false);
        network.getView().addEventListener('drop', function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            var text = e.dataTransfer.getData('Text');
            var imageText = e.dataTransfer.getData('Image');
            var shapeText = e.dataTransfer.getData('Shape');
            if (!text) {
                return false;
            }
            if (text && text.indexOf('className:') == 0) {
                var className = text.substr(10, text.length)
                if(className === "twaver.Node"){
                    if(imageText && imageText.indexOf('image:') == 0){
                        this._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e), imageText.substr(6, imageText.length));
                    }else if(shapeText && shapeText.indexOf('shape:') == 0){
                        this._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e), null, shapeText.substr(6, shapeText.length));
                    }else{
                        this._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e));
                    }
                }
            }
            if (text && text.indexOf('<twaver') == 0) {
                network.getElementBox().clear();
                new twaver.XmlSerializer(network.getElementBox()).deserialize(text);
            }
            return false;
        }, false);

        network.getView().setAttribute('draggable', 'true');
        network.getView().addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', new twaver.XmlSerializer(network.getElementBox()).serialize());
        }, false);

        return network;
    },
    addButton: function (div, name, src, callback) {
        var button = document.createElement('input');
        button.setAttribute('type', src ? 'image' : 'button');
        button.setAttribute('title', name);
        button.style.verticalAlign = 'top';
        if (src) {
            button.style.padding = '4px 4px 4px 4px';
            if (src.indexOf('/') < 0) {
                src = '../images/toolbar/' + src + '.png';
            }
            button.setAttribute('src', src);
        } else {
            button.value = name;
        }
        button.addEventListener('click', callback, false);
        div.appendChild(button);
        return button;
    },
    _createElement: function (network, className, centerLocation, imageSrc, vectorShape) {
        var element = twaver.Util.newInstance(className);
        element.setCenterLocation(centerLocation);
        element.setParent(network.getCurrentSubNetwork());
        if(imageSrc){
            element.setImage(imageSrc);
        }
        if(vectorShape){
            element.setStyle('body.type', 'vector');
            element.setStyle('vector.shape', vectorShape);
        }
        network.getElementBox().add(element);
        network.getElementBox().getSelectionModel().setSelection(element);
    },
    createDraggableNetwork: function (box) {
        var _this = this;
        var network = new twaver.vector.Network(box);

        network.getView().addEventListener('dragover', function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            e.dataTransfer.dropEffect = 'copy';
            return false;
        }, false);
        network.getView().addEventListener('drop', function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            var text = e.dataTransfer.getData('Text');
            var imageText = e.dataTransfer.getData('Image');
            var shapeText = e.dataTransfer.getData('Shape');
            if (!text) {
                return false;
            }
            if (text && text.indexOf('className:') == 0) {
                var className = text.substr(10, text.length)
                if(className === "twaver.Node"){
                    if(imageText && imageText.indexOf('image:') == 0){
                        _this._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e), imageText.substr(6, imageText.length));
                    }else if(shapeText && shapeText.indexOf('shape:') == 0){
                        _this._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e), null, shapeText.substr(6, shapeText.length));
                    }else{
                        _this._createElement(network, text.substr(10, text.length), network.getLogicalPoint(e));
                    }
                }
            }
            if (text && text.indexOf('<twaver') == 0) {
                network.getElementBox().clear();
                new twaver.XmlSerializer(network.getElementBox()).deserialize(text);
            }
            return false;
        }, false);

        network.getView().setAttribute('draggable', 'true');
        network.getView().addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('Text', new twaver.XmlSerializer(network.getElementBox()).serialize());
        }, false);
        return network;
    },
    registerImage: function (url, svg) {
        var _this = this;
        var image = new Image();
        image.src = url;
        var views = arguments;
        image.onload = function () {
            twaver.Util.registerImage(_this.getImageName(url), image, image.width, image.height, svg === true);
            image.onload = null;
            for (var i = 1; i < views.length; i++) {
                var view = views[i];
                if (view.invalidateElementUIs) {
                    view.invalidateElementUIs();
                }
                if (view.invalidateDisplay) {
                    view.invalidateDisplay();
                }
            }
        };
    }
});
