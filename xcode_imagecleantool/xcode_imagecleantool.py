#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import re
import sys
from collections import defaultdict

import imagehash
from PIL import Image

reload(sys)
sys.setdefaultencoding('utf8')


class ImageCleanTool:
    def __init__(self, searchpath):
        if os.path.isdir(searchpath):
            if os.path.isabs(searchpath):
                self.search_path = searchpath
                self.image_paths = []
                self.dhash_data = {}
                self.repeat_images = []
                self.similar_images = {}
                self.unused_images = []
            else:
                raise NameError("%s is not a absolute path" % searchpath)
        else:
            raise NameError("%s is not a directory" % searchpath)

    def _find_all_images(self, ignorepaths=None):
        def appendimage(files):
            for item in files:
                f = item.lower()
                if f.endswith(('.png', 'jpg', 'jpeg', 'gif')):
                    self.image_paths.append(os.path.join(dirpath, item))

        def find_all_ignore_paths(paths):
            ignore_paths = []
            if paths:
                for path in paths:
                    if os.path.isdir(path):
                        if os.path.isabs(path):
                            for dirpath, dirnames, filenames in os.walk(path):
                                ignore_paths.append(dirpath)
                        else:
                            raise NameError("%s is not a absolute path" % path)
                    else:
                        raise NameError("%s is not a directory" % path)
            return ignore_paths

        all_ignore_paths = find_all_ignore_paths(ignorepaths)
        for dirpath, dirnames, filenames in os.walk(self.search_path):
            # 忽略appicon和launchimage等路径
            if any(s in dirpath for s in ('.appiconset', '.brandassets', '.complicationset', \
                                          '.gcdashboardimage', '.iconset', '.launchimage', \
                                          '.gcleaderboardset', '.gcleaderboard', \
                                          '.stickersiconset', '.imagestack')):
                pass
            else:
                if dirpath not in all_ignore_paths:
                    appendimage(filenames)

    def _dhash(self):
        for path in self.image_paths:
            try:
                with Image.open(path) as img:
                    dhash = imagehash.dhash(img)
                    self.dhash_data[dhash] = self.dhash_data.get(dhash, []) + [path]
            except IOError:
                print "could not find image in", path

    def find_repeat_images(self, ignorepaths=None):
        # 图片相似且名称一样
        self._find_all_images(ignorepaths=ignorepaths)
        self._dhash()

        for k, image_list in self.dhash_data.items():
            if len(image_list) > 1:
                # 1 得到相似图片的名称列表
                image_names = []
                for item in image_list:
                    image_names.append(os.path.split(item)[1])

                # 2 计算该图片名称出现的次数
                repeat_images = defaultdict(list)
                for key, val in [(val, i) for i, val in enumerate(image_names)]:
                    repeat_images[key].append(val)

                # 3 如果出现2次及以上则判断为重复
                for value in repeat_images.values():
                    if len(value) > 1:
                        for i in value:
                            self.repeat_images.append(image_list[i])

        return self.repeat_images

    def find_similar_images(self, ignorepaths=None):
        # 需先处理重复图片的问题，因为这里会把2x 3x等图片默认为一个图片资源，所以如果不处理重复图片，可能会存在两张相似且重名且路径一样的图片只展示其中一张的问题
        self._find_all_images(ignorepaths=ignorepaths)
        self._dhash()

        re_imagepostfix = re.compile(r'^(.+)(@\dx\.\w+)$')
        for k, images in self.dhash_data.items():
            if len(images) > 1:
                image_dict = {}
                # 把同名，路径相同，存在2x 3x等相似图片合为一个图片资源
                for image in images:
                    path, name = os.path.split(image)
                    result = re_imagepostfix.match(name)
                    # 区分@2x @3x等类型图片
                    if result:
                        name = '%s-%s@.%s' % (path, result.group(1), result.group(2).split('.')[1])
                    else:
                        name = '%s-%s' % (path, name)
                    # 区分不同路径同名图片
                    image_dict[name] = image_dict.get(name, []) + [image]
                if len(image_dict.keys()) > 1:
                    self.similar_images[str(k)] = self.similar_images.get(str(k), []) + [image_dict]
        return self.similar_images

    def find_unused_images(self, ignorepaths=None):
        self._find_all_images(ignorepaths=ignorepaths)
        self._dhash()

        image_names = {}
        used_imgs = set()
        re_imagepostfix = re.compile(r'^(.+)(@\dx\.\w+)$')

        # 取到带后缀的文件名
        for item in self.image_paths:
            name = os.path.split(item)[1]
            result = re_imagepostfix.match(name)
            if result:
                name = '%s.%s' % (result.group(1), result.group(2).split(".")[1])
            image_names[name] = image_names.get(name, []) + [item]

        search_text = defaultdict(list)
        for image in image_names.keys():
            name_without_postfix = image.split(".")[0]
            search_text[image].append('"%s"' % image)
            search_text[image].append('"%s"' % name_without_postfix)

        for dirpath, dirnames, filenames in os.walk(self.search_path):
            for item in filenames:
                f = item.lower()
                if f.endswith(('.h', '.m', '.swift', '.mm', '.cpp', '.xib', '.storyboard', '.plist', '.html', '.css')):
                    filepath = os.path.join(dirpath, item)
                    try:
                        with open(filepath, 'r') as fileData:
                            for data in fileData.readlines():
                                for k, v in search_text.iteritems():
                                    for text in v:
                                        if data.find(text) != -1:
                                            used_imgs.add(k)
                    except IOError:
                        print "could not find path :" % filepath

        for item in used_imgs:
            if item in image_names.keys():
                del image_names[item]
        self.unused_images = [x for j in image_names.values() for x in j]

        return self.unused_images
