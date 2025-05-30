import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Remove as RemoveIcon,
    Search as SearchIcon,
    GetApp as DownloadIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tabs,
    TextField,
    Typography,
    Menu
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Données mockées
const INITIAL_CATEGORIES = [
    { id: 1, name: 'Alimentation' },
    { id: 2, name: 'Boissons' },
    { id: 3, name: 'Hygiène' },
    { id: 4, name: 'Ménager' }
];

const INITIAL_STOCK_HISTORY = [
    { id: 1, productId: 1, type: 'entrée', quantity: 50, date: '2024-03-01', user: 'Ibrahim Traoré' },
    { id: 2, productId: 1, type: 'sortie', quantity: 10, date: '2024-03-02', user: 'Ibrahim Traoré' },
    { id: 3, productId: 2, type: 'entrée', quantity: 30, date: '2024-03-01', user: 'Ibrahim Traoré' }
];

function StockistInterface() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [stockHistory, setStockHistory] = useState(INITIAL_STOCK_HISTORY);
    const [products, setProducts] = useState([
        { id: 1, name: 'Riz local', quantity: 50, minQuantity: 10, price: 50000, categoryId: 1 },
        { id: 2, name: 'Huile végétale', quantity: 30, minQuantity: 5, price: 15000, categoryId: 1 },
        { id: 3, name: 'Sucre', quantity: 20, minQuantity: 8, price: 10000, categoryId: 1 }
    ]);
    const [showLowStockAlert, setShowLowStockAlert] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [openProductDialog, setOpenProductDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        quantity: 0,
        minQuantity: 0,
        price: 0,
        categoryId: 1
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [historyFilters, setHistoryFilters] = useState({
        startDate: null,
        endDate: null,
        type: 'all'
    });

    // Export des rapports
    const handleExportReport = (format) => {
        const data = generateReport('month'); // Par défaut, on exporte le rapport mensuel
        const headers = ['Date', 'Produit', 'Type', 'Quantité', 'Utilisateur'];
        
        const exportData = data.map(entry => [
            entry.date,
            products.find(p => p.id === entry.productId)?.name || '',
            entry.type,
            entry.quantity,
            entry.user
        ]);

        if (format === 'excel') {
            const ws = XLSX.utils.aoa_to_sheet([headers, ...exportData]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Rapport');
            XLSX.writeFile(wb, `rapport_stock_${new Date().toISOString().split('T')[0]}.xlsx`);
        } else if (format === 'pdf') {
            const doc = new jsPDF();
            doc.autoTable({
                head: [headers],
                body: exportData,
                theme: 'grid'
            });
            doc.save(`rapport_stock_${new Date().toISOString().split('T')[0]}.pdf`);
        }
    };

    // Gestion du menu d'export
    const [exportAnchorEl, setExportAnchorEl] = useState(null);
    const handleExportClick = (event) => {
        setExportAnchorEl(event.currentTarget);
    };
    const handleExportClose = () => {
        setExportAnchorEl(null);
    };

    // Pagination de l'historique
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filtrage de l'historique
    const filteredHistory = stockHistory.filter(entry => {
        if (historyFilters.startDate && new Date(entry.date) < new Date(historyFilters.startDate)) {
            return false;
        }
        if (historyFilters.endDate && new Date(entry.date) > new Date(historyFilters.endDate)) {
            return false;
        }
        if (historyFilters.type !== 'all' && entry.type !== historyFilters.type) {
            return false;
        }
        return true;
    });

    const paginatedHistory = filteredHistory.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Gestion des catégories
    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory = {
                id: categories.length + 1,
                name: newCategoryName.trim()
            };
            setCategories([...categories, newCategory]);
            setOpenCategoryDialog(false);
            setNewCategoryName('');
        }
    };

    const handleEditCategory = (category) => {
        if (editingCategory && editingCategory.name.trim()) {
            setCategories(categories.map(c =>
                c.id === editingCategory.id
                    ? { ...c, name: editingCategory.name.trim() }
                    : c
            ));
            setEditingCategory(null);
            setOpenCategoryDialog(false);
        }
    };

    const handleDeleteCategory = (categoryId) => {
        // Vérifier si la catégorie est utilisée
        const productsInCategory = products.filter(p => p.categoryId === categoryId);
        if (productsInCategory.length > 0) {
            alert('Cette catégorie contient des produits et ne peut pas être supprimée.');
            return;
        }

        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            setCategories(categories.filter(c => c.id !== categoryId));
        }
    };

    // Filtrage des produits
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.categoryId === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    // Gestion des mouvements de stock
    const handleStockMovement = (productId, type, quantity) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const newQuantity = type === 'entrée' ? product.quantity + quantity : product.quantity - quantity;
            if (newQuantity >= 0) {
                setProducts(products.map(p =>
                    p.id === productId ? { ...p, quantity: newQuantity } : p
                ));
                
                const newHistoryEntry = {
                    id: stockHistory.length + 1,
                    productId,
                    type,
                    quantity,
                    date: new Date().toISOString().split('T')[0],
                    user: user?.name || 'Utilisateur inconnu'
                };
                setStockHistory([...stockHistory, newHistoryEntry]);
            }
        }
    };

    // Génération de rapports
    const generateReport = (period) => {
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'day':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            default:
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        }

        return stockHistory.filter(entry => new Date(entry.date) >= startDate);
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity >= 0) {
            setProducts(products.map(product =>
                product.id === productId
                    ? { ...product, quantity: newQuantity }
                    : product
            ));
        }
    };

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.quantity >= 0 && newProduct.minQuantity >= 0 && newProduct.price >= 0) {
            const productToAdd = {
                ...newProduct,
                id: products.length + 1
            };
            setProducts([...products, productToAdd]);
            setNewProduct({
                name: '',
                quantity: 0,
                minQuantity: 0,
                price: 0,
                categoryId: 1
            });
            setOpenProductDialog(false);
        }
    };

    const handleEditProduct = (product) => {
        if (editingProduct) {
            setProducts(products.map(p =>
                p.id === editingProduct.id
                    ? { ...editingProduct }
                    : p
            ));
            setEditingProduct(null);
            setOpenProductDialog(false);
        }
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            setProducts(products.filter(product => product.id !== productId));
        }
    };

    const getLowStockProducts = () => {
        return products.filter(product => product.quantity <= product.minQuantity);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Gestion des stocks - {user?.name}
                </Typography>
                <Button variant="outlined" onClick={logout}>
                    Déconnexion
                </Button>
            </Box>

            {/* Onglets */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label="Stock" />
                    <Tab label="Historique" />
                    <Tab label="Rapports" />
                    <Tab label="Catégories" />
                </Tabs>
            </Box>

            {/* Contenu des onglets */}
            {activeTab === 0 && (
                <>
                    {/* Alertes de stock bas */}
                    {showLowStockAlert && getLowStockProducts().length > 0 && (
                        <Alert
                            severity="warning"
                            sx={{ mb: 3 }}
                            onClose={() => setShowLowStockAlert(false)}
                        >
                            Attention: {getLowStockProducts().length} produit(s) en stock bas
                        </Alert>
                    )}

                    {/* Filtres */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <TextField
                            label="Rechercher un produit"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Catégorie"
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <MenuItem value="all">Toutes les catégories</MenuItem>
                                {categories.map(category => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Liste des produits */}
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Produits en stock</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenProductDialog(true)}
                                >
                                    Ajouter un produit
                                </Button>
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produit</TableCell>
                                            <TableCell>Catégorie</TableCell>
                                            <TableCell align="right">Prix</TableCell>
                                            <TableCell align="right">Quantité</TableCell>
                                            <TableCell align="right">Minimum</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredProducts.map((product) => (
                                            <TableRow
                                                key={product.id}
                                                sx={{
                                                    bgcolor: product.quantity <= product.minQuantity ? '#fff3e0' : 'inherit'
                                                }}
                                            >
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>
                                                    {categories.find(c => c.id === product.categoryId)?.name}
                                                </TableCell>
                                                <TableCell align="right">{product.price.toLocaleString()} GNF</TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleStockMovement(product.id, 'sortie', 1)}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <Typography sx={{ mx: 1 }}>{product.quantity}</Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleStockMovement(product.id, 'entrée', 1)}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{product.minQuantity}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => {
                                                        setEditingProduct(product);
                                                        setOpenProductDialog(true);
                                                    }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeleteProduct(product.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </>
            )}

            {activeTab === 1 && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Historique des mouvements</Typography>
                            <Box>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleExportClick}
                                >
                                    Exporter
                                </Button>
                                <Menu
                                    anchorEl={exportAnchorEl}
                                    open={Boolean(exportAnchorEl)}
                                    onClose={handleExportClose}
                                >
                                    <MenuItem onClick={() => {
                                        handleExportReport('excel');
                                        handleExportClose();
                                    }}>
                                        Export Excel
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        handleExportReport('pdf');
                                        handleExportClose();
                                    }}>
                                        Export PDF
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>

                        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                            <TextField
                                type="date"
                                label="Date début"
                                value={historyFilters.startDate || ''}
                                onChange={(e) => setHistoryFilters({
                                    ...historyFilters,
                                    startDate: e.target.value
                                })}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                type="date"
                                label="Date fin"
                                value={historyFilters.endDate || ''}
                                onChange={(e) => setHistoryFilters({
                                    ...historyFilters,
                                    endDate: e.target.value
                                })}
                                InputLabelProps={{ shrink: true }}
                            />
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={historyFilters.type}
                                    label="Type"
                                    onChange={(e) => setHistoryFilters({
                                        ...historyFilters,
                                        type: e.target.value
                                    })}
                                >
                                    <MenuItem value="all">Tous</MenuItem>
                                    <MenuItem value="entrée">Entrées</MenuItem>
                                    <MenuItem value="sortie">Sorties</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Produit</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Quantité</TableCell>
                                        <TableCell>Utilisateur</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedHistory.map(entry => (
                                        <TableRow key={entry.id}>
                                            <TableCell>{entry.date}</TableCell>
                                            <TableCell>
                                                {products.find(p => p.id === entry.productId)?.name}
                                            </TableCell>
                                            <TableCell>{entry.type}</TableCell>
                                            <TableCell align="right">{entry.quantity}</TableCell>
                                            <TableCell>{entry.user}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={filteredHistory.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Lignes par page"
                        />
                    </CardContent>
                </Card>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Rapport journalier</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Produit</TableCell>
                                                <TableCell align="right">Entrées</TableCell>
                                                <TableCell align="right">Sorties</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {generateReport('day').map(entry => (
                                                <TableRow key={entry.id}>
                                                    <TableCell>
                                                        {products.find(p => p.id === entry.productId)?.name}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {entry.type === 'entrée' ? entry.quantity : 0}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {entry.type === 'sortie' ? entry.quantity : 0}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Statistiques</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Total produits</TableCell>
                                                <TableCell align="right">{products.length}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Produits en stock bas</TableCell>
                                                <TableCell align="right">{getLowStockProducts().length}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Valeur totale du stock</TableCell>
                                                <TableCell align="right">
                                                    {products.reduce((total, product) => total + (product.price * product.quantity), 0).toLocaleString()} GNF
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 3 && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Catégories de produits</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenCategoryDialog(true)}
                            >
                                Ajouter une catégorie
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom</TableCell>
                                        <TableCell>Nombre de produits</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map(category => (
                                        <TableRow key={category.id}>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>
                                                {products.filter(p => p.categoryId === category.id).length}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => {
                                                    setEditingCategory(category);
                                                    setOpenCategoryDialog(true);
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteCategory(category.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {/* Dialog pour ajouter/modifier une catégorie */}
            <Dialog open={openCategoryDialog} onClose={() => {
                setOpenCategoryDialog(false);
                setEditingCategory(null);
            }}>
                <DialogTitle>{editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nom de la catégorie"
                        fullWidth
                        value={editingCategory ? editingCategory.name : newCategoryName}
                        onChange={(e) => editingCategory 
                            ? setEditingCategory({ ...editingCategory, name: e.target.value })
                            : setNewCategoryName(e.target.value)
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenCategoryDialog(false);
                        setEditingCategory(null);
                    }}>
                        Annuler
                    </Button>
                    <Button 
                        onClick={editingCategory ? handleEditCategory : handleAddCategory} 
                        variant="contained"
                    >
                        {editingCategory ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog pour ajouter/modifier un produit */}
            <Dialog open={openProductDialog} onClose={() => {
                setOpenProductDialog(false);
                setEditingProduct(null);
            }}>
                <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nom du produit"
                        fullWidth
                        value={editingProduct ? editingProduct.name : newProduct.name}
                        onChange={(e) => editingProduct 
                            ? setEditingProduct({ ...editingProduct, name: e.target.value })
                            : setNewProduct({ ...newProduct, name: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Quantité"
                        type="number"
                        fullWidth
                        value={editingProduct ? editingProduct.quantity : newProduct.quantity}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0) {
                                editingProduct 
                                    ? setEditingProduct({ ...editingProduct, quantity: value })
                                    : setNewProduct({ ...newProduct, quantity: value });
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Quantité minimale"
                        type="number"
                        fullWidth
                        value={editingProduct ? editingProduct.minQuantity : newProduct.minQuantity}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0) {
                                editingProduct 
                                    ? setEditingProduct({ ...editingProduct, minQuantity: value })
                                    : setNewProduct({ ...newProduct, minQuantity: value });
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Prix"
                        type="number"
                        fullWidth
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0) {
                                editingProduct 
                                    ? setEditingProduct({ ...editingProduct, price: value })
                                    : setNewProduct({ ...newProduct, price: value });
                            }
                        }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Catégorie</InputLabel>
                        <Select
                            value={editingProduct ? editingProduct.categoryId : newProduct.categoryId}
                            label="Catégorie"
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                editingProduct 
                                    ? setEditingProduct({ ...editingProduct, categoryId: value })
                                    : setNewProduct({ ...newProduct, categoryId: value });
                            }}
                        >
                            {categories.map(category => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenProductDialog(false);
                        setEditingProduct(null);
                    }}>
                        Annuler
                    </Button>
                    <Button 
                        onClick={editingProduct ? handleEditProduct : handleAddProduct} 
                        variant="contained"
                    >
                        {editingProduct ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default StockistInterface; 