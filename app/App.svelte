{#if showForm}
  <GridLayout rows="*" columns="*" class="modal">
    <StackLayout class="form" row="0" col="0">
      <Label text="Adicionar Novo Produto" class="title" />
      <TextField bind:text={newProduct.name} hint="Nome do Produto" class="input" />
      <DatePicker bind:date={newProduct.openingDate} class="input" />
      <DatePicker bind:date={newProduct.expirationDate} class="input" />
      <TextView bind:text={newProduct.notes} hint="Observações" class="input" rows="3" />
      <FlexboxLayout class="button-row">
        <Button text="Cancelar" on:tap={() => showForm = false} class="btn-secondary" />
        <Button text="Salvar" on:tap={addProduct} class="btn-primary" />
      </FlexboxLayout>
    </StackLayout>
  </GridLayout>
{/if}

<ActionBar title="Controle de Produtos">
  <ActionItem on:tap={() => showForm = true} ios.position="right" android.position="actionBar">
    <Label text="+" class="action-item" />
  </ActionItem>
</ActionBar>

<GridLayout rows="auto, *">
  <SearchBar row="0" hint="Buscar produtos..." bind:text={searchText} />
  
  <ListView row="1" items={filteredProducts} class="list-group">
    <Template let:item>
      <GridLayout columns="*, auto" rows="auto, auto, auto" class="list-group-item">
        <Label col="0" row="0" text={item.name} class="product-name" />
        <Label col="0" row="1" text={`Aberto em: ${formatDate(item.openingDate)}`} class="date" />
        <Label col="0" row="2" text={getExpirationText(item.expirationDate)} class={getExpirationClass(item.expirationDate)} />
        {#if item.notes}
          <Label col="0" row="3" text={item.notes} class="notes" textWrap="true" />
        {/if}
        <Button col="1" row="0" text="×" on:tap={() => deleteProduct(item.id)} class="delete-btn" />
      </GridLayout>
    </Template>
  </ListView>
</GridLayout>

<script lang="typescript">
  import { formatDistanceToNow } from 'date-fns'
  import { ptBR } from 'date-fns/locale'
  
  let products = []
  let showForm = false
  let searchText = ''
  
  let newProduct = {
    name: '',
    openingDate: new Date(),
    expirationDate: new Date(),
    notes: ''
  }
  
  $: filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase())
  )
  
  function addProduct() {
    products = [...products, {
      id: Date.now().toString(),
      ...newProduct
    }]
    showForm = false
    newProduct = {
      name: '',
      openingDate: new Date(),
      expirationDate: new Date(),
      notes: ''
    }
  }
  
  function deleteProduct(id) {
    products = products.filter(p => p.id !== id)
  }
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR')
  }
  
  function isExpiringSoon(date) {
    const days = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days <= 7 && days > 0
  }
  
  function isExpired(date) {
    return new Date(date) < new Date()
  }
  
  function getExpirationText(date) {
    return `Vence ${formatDistanceToNow(new Date(date), { locale: ptBR, addSuffix: true })}`
  }
  
  function getExpirationClass(date) {
    return isExpired(date) 
      ? 'expired' 
      : isExpiringSoon(date) 
        ? 'expiring-soon' 
        : 'valid'
  }
</script>

<style>
  .modal {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .form {
    background-color: white;
    padding: 20;
    border-radius: 10;
    width: 80%;
    vertical-align: middle;
  }
  
  .title {
    font-size: 20;
    font-weight: bold;
    margin-bottom: 15;
  }
  
  .input {
    margin-bottom: 15;
  }
  
  .button-row {
    justify-content: flex-end;
    gap: 10;
  }
  
  .btn-primary {
    background-color: #4f46e5;
    color: white;
  }
  
  .btn-secondary {
    background-color: #e5e7eb;
  }
  
  .product-name {
    font-size: 18;
    font-weight: bold;
  }
  
  .date {
    font-size: 14;
    color: #666;
  }
  
  .expired {
    color: #dc2626;
  }
  
  .expiring-soon {
    color: #d97706;
  }
  
  .valid {
    color: #059669;
  }
  
  .notes {
    font-style: italic;
    color: #666;
    margin-top: 5;
  }
  
  .delete-btn {
    font-size: 20;
    background-color: transparent;
    color: #dc2626;
    width: 40;
    height: 40;
    padding: 0;
  }
  
  .action-item {
    font-size: 24;
    font-weight: bold;
    color: white;
    margin-right: 10;
  }
</style>