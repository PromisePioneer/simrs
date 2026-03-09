import React, {useEffect, useState} from 'react';
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ChevronDown, ChevronRight, Edit, GripVertical, Loader2, Plus, Trash2} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Badge} from '@/components/ui/badge';
import {Alert, AlertDescription} from '@/components/ui/alert';

const SortableItem = ({id, item, depth, expandedItems, toggleExpanded, onEdit, onDelete, isOver, dragDepth}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const hasChildren = item.children_recursive && item.children_recursive.length > 0;
    const isExpanded = expandedItems.includes(id);

    return (
        <div ref={setNodeRef} style={style} className="mb-2 relative">
            <div
                className={`flex items-center gap-2 p-3 border rounded-md bg-card transition-all ${
                    isDragging
                        ? 'shadow-2xl border-primary scale-105 bg-primary/5'
                        : isOver
                            ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary'
                            : 'hover:bg-accent/50 hover:shadow-md'
                }`}
                style={{paddingLeft: `${depth * 24 + 12}px`}}
            >
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
                    <GripVertical
                        className={`h-5 w-5 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}/>
                </div>

                {hasChildren ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleExpanded(id)}
                    >
                        {isExpanded ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                    </Button>
                ) : (
                    <div className="w-6"/>
                )}

                <div className="flex-1">
                    <div className={`font-medium transition-colors ${isDragging ? 'text-primary' : ''}`}>
                        {item.name}
                    </div>
                    {item.route && (
                        <div className="text-sm text-muted-foreground">{item.route}</div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {item.permissions && item.permissions.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {item.permissions.length} permissions
                        </Badge>
                    )}

                    {!isDragging && (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                <Edit className="h-4 w-4"/>
                            </Button>

                            <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {isOver && dragDepth !== null && dragDepth < depth + 1 && (
                <div
                    className="mt-2 p-3 border-2 border-dashed border-primary rounded-md bg-primary/5"
                    style={{marginLeft: `${(depth + 1) * 24 + 12}px`}}
                >
                    <div className="text-xs text-primary font-medium flex items-center gap-2">
                        <ChevronRight className="h-3 w-3"/>
                        Drop di sini untuk jadikan sub-menu
                    </div>
                </div>
            )}
        </div>
    );
};

const ModuleDragDropMenu = ({initialModules = [], onSave}) => {
    const [menuItems, setMenuItems] = useState([]);
    const [expandedItems, setExpandedItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [dragDepth, setDragDepth] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const sortedModules = [...initialModules].sort((a, b) => (a.order || 0) - (b.order || 0));
        setMenuItems(sortedModules);
        const itemsWithChildren = initialModules
            .filter(item => item.children_recursive && item.children_recursive.length > 0)
            .map(item => item.id);
        setExpandedItems(itemsWithChildren);

        setIsLoading(false);
    }, [initialModules]);


    const flattenTree = (items) => {
        const result = [];

        const addItem = (item, depth = 0, parentId = null) => {
            result.push({...item, depth, parent_id: parentId});

            if (item.children_recursive &&
                item.children_recursive.length > 0 &&
                expandedItems.includes(item.id)) {
                const sortedChildren = [...item.children_recursive].sort((a, b) => (a.order || 0) - (b.order || 0));
                sortedChildren.forEach(child => addItem(child, depth + 1, item.id));
            }
        };

        items.forEach(item => addItem(item, 0, null));
        return result;
    };

    const findItemById = (items, id) => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children_recursive && item.children_recursive.length > 0) {
                const found = findItemById(item.children_recursive, id);
                if (found) return found;
            }
        }
        return null;
    };

    const isDescendant = (items, parentId, childId) => {
        const parent = findItemById(items, parentId);
        if (!parent) return false;

        const checkChildren = (item) => {
            if (item.id === childId) return true;
            if (item.children_recursive && item.children_recursive.length > 0) {
                return item.children_recursive.some(child => checkChildren(child));
            }
            return false;
        };

        return checkChildren(parent);
    };

    const handleDragStart = (event) => {
        const {active} = event;
        setActiveId(active.id);

        const flatItems = flattenTree(menuItems);
        const activeItem = flatItems.find(item => item.id === active.id);
        setDragDepth(activeItem?.depth || 0);
    };

    const handleDragOver = (event) => {
        setOverId(event.over?.id || null);
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;

        setActiveId(null);
        setOverId(null);
        setDragDepth(null);

        if (!over || active.id === over.id) return;

        if (isDescendant(menuItems, active.id, over.id)) {
            alert('Tidak bisa memindahkan parent ke dalam childnya sendiri!');
            return;
        }

        const flatItems = flattenTree(menuItems);
        const activeItem = flatItems.find(item => item.id === active.id);
        const overItem = flatItems.find(item => item.id === over.id);

        if (!activeItem || !overItem) return;

        const isSameLevel = activeItem.parent_id === overItem.parent_id;

        if (isSameLevel) {
            setMenuItems(prev => reorderItemsAtSameLevel(prev, active.id, over.id, activeItem.parent_id));
        } else {
            setMenuItems(prev => moveItemAsChild(prev, active.id, over.id));
            if (!expandedItems.includes(over.id)) {
                setExpandedItems([...expandedItems, over.id]);
            }
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setOverId(null);
        setDragDepth(null);
    };

    const removeItemFromTree = (items, itemId) => {
        let removedItem = null;

        const filterItems = (arr) => {
            return arr.filter(item => {
                if (item.id === itemId) {
                    removedItem = {...item};
                    return false;
                }

                if (item.children_recursive && item.children_recursive.length > 0) {
                    item.children_recursive = filterItems(item.children_recursive);
                }

                return true;
            });
        };

        const newItems = filterItems([...items]);
        return {newItems, removedItem};
    };

    const moveItemAsChild = (items, activeId, overId) => {
        const {newItems, removedItem} = removeItemFromTree(items, activeId);

        if (!removedItem) return items;

        const addAsChild = (arr) => {
            return arr.map(item => {
                if (item.id === overId) {
                    return {
                        ...item,
                        children_recursive: [
                            ...(item.children_recursive || []),
                            {...removedItem, parent_id: item.id}
                        ]
                    };
                }

                if (item.children_recursive && item.children_recursive.length > 0) {
                    return {
                        ...item,
                        children_recursive: addAsChild(item.children_recursive)
                    };
                }

                return item;
            });
        };

        return addAsChild(newItems);
    };

    const reorderItemsAtSameLevel = (items, activeId, overId, parentId) => {
        if (parentId === null) {
            const newItems = [...items];
            const activeIndex = newItems.findIndex(item => item.id === activeId);
            const overIndex = newItems.findIndex(item => item.id === overId);

            if (activeIndex === -1 || overIndex === -1) return items;

            const [removed] = newItems.splice(activeIndex, 1);
            newItems.splice(overIndex, 0, removed);

            return newItems;
        }

        const reorderChildren = (arr) => {
            return arr.map(item => {
                if (item.id === parentId) {
                    const children = [...(item.children_recursive || [])];
                    const activeIndex = children.findIndex(child => child.id === activeId);
                    const overIndex = children.findIndex(child => child.id === overId);

                    if (activeIndex === -1 || overIndex === -1) return item;

                    const [removed] = children.splice(activeIndex, 1);
                    children.splice(overIndex, 0, removed);

                    return {...item, children_recursive: children};
                }

                if (item.children_recursive && item.children_recursive.length > 0) {
                    return {
                        ...item,
                        children_recursive: reorderChildren(item.children_recursive)
                    };
                }

                return item;
            });
        };

        return reorderChildren(items);
    };

    const toggleExpanded = (id) => {
        setExpandedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleEdit = (item) => {
        setEditingItem({...item});
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

        const removeItem = (items) => {
            return items.filter(item => {
                if (item.id === id) return false;

                if (item.children_recursive && item.children_recursive.length > 0) {
                    item.children_recursive = removeItem(item.children_recursive);
                }

                return true;
            });
        };

        setMenuItems(removeItem(menuItems));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const flattenItems = (items, parentId = null) => {
                return items.reduce((acc, item, index) => {
                    const flatItem = {
                        id: item.id,
                        name: item.name,
                        route: item.route,
                        icon: item.icon,
                        parent_id: parentId,
                        order: index + 1,
                        permissions: item.permissions || [],
                    };

                    acc.push(flatItem);

                    if (item.children_recursive && item.children_recursive.length > 0) {
                        acc.push(...flattenItems(item.children_recursive, item.id));
                    }

                    return acc;
                }, []);
            };

            const flattenedItems = flattenItems(menuItems);

            if (onSave) {
                await onSave(flattenedItems);
                alert('Perubahan berhasil disimpan!');
            } else {
                console.log('Saving modules:', flattenedItems);
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Perubahan berhasil disimpan!');
            }
        } catch (err) {
            setError(err.message || 'Gagal menyimpan perubahan');
            console.error('Error saving modules:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddItem = () => {
        const newItem = {
            id: `new-${Date.now()}`,
            name: 'Menu Item Baru',
            route: '',
            parent_id: null,
            order: menuItems.length + 1,
            icon: 'Plus',
            permissions: [],
            children_recursive: []
        };

        setMenuItems([...menuItems, newItem]);
        setEditingItem(newItem);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editingItem) return;

        const updateItem = (items) => {
            return items.map(item => {
                if (item.id === editingItem.id) {
                    return {
                        ...item,
                        name: editingItem.name,
                        route: editingItem.route,
                        icon: editingItem.icon
                    };
                }

                if (item.children_recursive && item.children_recursive.length > 0) {
                    return {
                        ...item,
                        children_recursive: updateItem(item.children_recursive)
                    };
                }

                return item;
            });
        };

        setMenuItems(updateItem(menuItems));
        setIsEditDialogOpen(false);
        setEditingItem(null);
    };

    const flatItems = flattenTree(menuItems);

    if (isLoading) {
        return (
            <Card className="w-full max-w-4xl mx-auto mt-8">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    <span className="ml-2">Memuat data modul...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Nestable Menu Management</CardTitle>
                <CardDescription>
                    Drag item ke item lain untuk menjadikannya sub-menu. Drag di posisi yang sama untuk mengatur urutan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="mb-4">
                    <Button onClick={handleAddItem}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Tambah Menu Item
                    </Button>
                </div>

                {flatItems.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                        Tidak ada menu item. Klik "Tambah Menu Item" untuk membuat menu baru.
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext items={flatItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-1">
                                {flatItems.map(item => (
                                    <SortableItem
                                        key={item.id}
                                        id={item.id}
                                        item={item}
                                        depth={item.depth}
                                        expandedItems={expandedItems}
                                        toggleExpanded={toggleExpanded}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isOver={overId === item.id}
                                        dragDepth={dragDepth}
                                    />
                                ))}
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeId ? (() => {
                                const draggedItem = findItemById(menuItems, activeId);

                                const renderDragItem = (item, depth = 0) => (
                                    <div key={item.id} className="mb-1">
                                        <div
                                            className="flex items-center gap-2 p-3 border-2 border-primary rounded-md bg-card shadow-2xl"
                                            style={{paddingLeft: `${depth * 24 + 12}px`}}
                                        >
                                            <GripVertical className="h-5 w-5 text-primary"/>
                                            {item.children_recursive && item.children_recursive.length > 0 && (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground"/>
                                            )}
                                            {!item.children_recursive?.length && <div className="w-4"/>}
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                {item.route && (
                                                    <div className="text-sm text-muted-foreground">{item.route}</div>
                                                )}
                                            </div>
                                        </div>
                                        {item.children_recursive && item.children_recursive.length > 0 && (
                                            <div className="mt-1">
                                                {item.children_recursive.map(child => renderDragItem(child, depth + 1))}
                                            </div>
                                        )}
                                    </div>
                                );

                                return draggedItem ? renderDragItem(draggedItem) : null;
                            })() : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                    {flatItems.length} item ditampilkan
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                            Menyimpan...
                        </>
                    ) : (
                        'Simpan Perubahan'
                    )}
                </Button>
            </CardFooter>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Menu Item</DialogTitle>
                        <DialogDescription>
                            Ubah informasi menu item. Klik simpan setelah selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nama
                            </Label>
                            <Input
                                id="name"
                                value={editingItem?.name || ''}
                                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="route" className="text-right">
                                Route
                            </Label>
                            <Input
                                id="route"
                                value={editingItem?.route || ''}
                                onChange={(e) => setEditingItem({...editingItem, route: e.target.value})}
                                className="col-span-3"
                                placeholder="/example/route"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="icon" className="text-right">
                                Icon
                            </Label>
                            <Input
                                id="icon"
                                value={editingItem?.icon || ''}
                                onChange={(e) => setEditingItem({...editingItem, icon: e.target.value})}
                                className="col-span-3"
                                placeholder="Home, Users, Settings"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" onClick={handleSaveEdit}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default ModuleDragDropMenu;